import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRestaurantDto) {
    try {
      // Check if cuisine exists
      const cuisine = await this.prisma.cuisine.findUnique({
        where: { id: dto.cuisine_id },
      });

      if (!cuisine) {
        throw new NotFoundException('Cuisine not found');
      }

      const restaurant = await this.prisma.restaurant.create({
        data: {
          name: dto.name,
          description: dto.description,
          tags: dto.tags,
          latitude: dto.latitude,
          longitude: dto.longitude,
          slug: dto.name.toLowerCase().replace(/\s+/g, '-'),
          city: { connect: { id: dto.city_id } },
          cuisine: { connect: { id: dto.cuisine_id } },
        },
        include: {
          cuisine: true,
          city: true,
        },
      });
  
      return restaurant;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          // ❌ No city found for nested connect
          throw new BadRequestException('City not found');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('Restaurant already exists');
        }
      }
  
      console.error(error); // logs full Prisma error in terminal for dev
      throw new InternalServerErrorException('Failed to create restaurant');
    }
  }

  async findAll() {
    return this.prisma.restaurant.findMany({
      include: {
        city: true,
        cuisine: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findBySlug(slug: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  async findDetailBySlug(slug: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
      include: {
        city: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        cuisine: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        stats: true,
        dishes: {
          where: {
            is_active: true,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            image_url: true,
            description: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            stats: true,
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 10, // Get top 10 dishes for signature dishes
        },
        _count: {
          select: {
            dishes: true,
          },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Sort dishes by score/rating for signature dishes
    const sortedDishes = restaurant.dishes.sort((a, b) => {
      const scoreA = a.stats?.score ?? 0;
      const scoreB = b.stats?.score ?? 0;
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      const ratingA = a.stats?.avg_rating ?? 0;
      const ratingB = b.stats?.avg_rating ?? 0;
      return ratingB - ratingA;
    });

    return {
      ...restaurant,
      dishes: sortedDishes,
    };
  }

  async update(id: string, dto: UpdateRestaurantDto) {
    try {
      // Build update data object, only including provided fields
      const updateData: any = {};
      
      if (dto.name !== undefined) {
        updateData.name = dto.name;
        updateData.slug = dto.name.toLowerCase().replace(/\s+/g, '-');
      }
      if (dto.description !== undefined) updateData.description = dto.description;
      if (dto.tags !== undefined) updateData.tags = dto.tags;
      if (dto.latitude !== undefined) updateData.latitude = dto.latitude;
      if (dto.longitude !== undefined) updateData.longitude = dto.longitude;
      if (dto.city_id !== undefined) {
        updateData.city = { connect: { id: dto.city_id } };
        // Cascade city_id update to all dishes when restaurant city changes
        // This maintains data consistency for the denormalized city_id field
        await this.prisma.dish.updateMany({
          where: { restaurant_id: id },
          data: { city_id: dto.city_id },
        });
      }
      if (dto.cuisine_id !== undefined) {
        // Check if cuisine exists
        const cuisine = await this.prisma.cuisine.findUnique({
          where: { id: dto.cuisine_id },
        });

        if (!cuisine) {
          throw new NotFoundException('Cuisine not found');
        }

        updateData.cuisine = { connect: { id: dto.cuisine_id } };
      }

      const restaurant = await this.prisma.restaurant.update({
        where: { id },
        data: updateData,
        include: {
          cuisine: true,
          city: true,
        },
      });

      return restaurant;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Restaurant not found');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('Restaurant with this name already exists');
        }
        if (error.code === 'P2025' && error.meta?.cause === 'Record to update not found') {
          throw new NotFoundException('City not found');
        }
      }

      console.error(error);
      throw new InternalServerErrorException('Failed to update restaurant');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.restaurant.delete({
        where: { id },
      });
      return { message: 'Restaurant deleted successfully' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Restaurant not found');
        }
      }

      console.error(error);
      throw new InternalServerErrorException('Failed to delete restaurant');
    }
  }
}
