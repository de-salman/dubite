import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class DishService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDishDto) {
    try {
      // Check if restaurant exists
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: dto.restaurant_id },
      });

      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      // Check if restaurant already has 5 dishes
      const dishCount = await this.prisma.dish.count({
        where: {
          restaurant_id: dto.restaurant_id,
        },
      });

      if (dishCount >= 5) {
        throw new BadRequestException('Restaurant can have maximum 5 dishes');
      }

      // Check if category exists
      const category = await this.prisma.category.findUnique({
        where: { id: dto.category_id },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      // Create dish with city_id from restaurant (denormalized for performance)
      const dish = await this.prisma.dish.create({
        data: {
          name: dto.name,
          slug: dto.name.toLowerCase().replace(/\s+/g, '-'),
          description: dto.description,
          price: dto.price,
          tags: dto.tags,
          image_url: dto.image_url,
          restaurant_id: dto.restaurant_id,
          category_id: dto.category_id,
          city_id: restaurant.city_id, // Set city_id directly from restaurant
        },
        include: {
          restaurant: true,
          category: true,
        },
      });

      return dish;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Dish with this name already exists');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('Restaurant not found');
        }
      }

      console.error(error);
      throw new InternalServerErrorException('Failed to create dish');
    }
  }

  async findByRestaurant(restaurantId: string) {
    // Check if restaurant exists
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return this.prisma.dish.findMany({
      where: {
        restaurant_id: restaurantId,
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
          },
        },
        category: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findBySlug(slug: string) {
    // Try to find by slug first
    let dish = await this.prisma.dish.findUnique({
      where: { slug },
      include: {
        restaurant: {
          include: {
            city: true,
            cuisine: true,
          },
        },
        category: true,
        stats: true,
      },
    });

    // If not found by slug, try to find by ID (fallback for dishes without slugs)
    if (!dish) {
      dish = await this.prisma.dish.findUnique({
        where: { id: slug },
        include: {
          restaurant: {
            include: {
              city: true,
              cuisine: true,
            },
          },
          category: true,
          stats: true,
        },
      });
    }

    if (!dish) {
      throw new NotFoundException('Dish not found');
    }

    return dish;
  }

  async update(id: string, dto: UpdateDishDto) {
    try {
      // Build update data object, only including provided fields
      const updateData: any = {};
      
      if (dto.name !== undefined) {
        updateData.name = dto.name;
        updateData.slug = dto.name.toLowerCase().replace(/\s+/g, '-');
      }
      if (dto.category_id !== undefined) {
        // Check if category exists
        const category = await this.prisma.category.findUnique({
          where: { id: dto.category_id },
        });

        if (!category) {
          throw new NotFoundException('Category not found');
        }

        updateData.category = { connect: { id: dto.category_id } };
      }
      if (dto.description !== undefined) updateData.description = dto.description;
      if (dto.price !== undefined) updateData.price = dto.price;
      if (dto.tags !== undefined) updateData.tags = dto.tags;
      if (dto.image_url !== undefined) updateData.image_url = dto.image_url;
      if (dto.is_active !== undefined) updateData.is_active = dto.is_active;

      const dish = await this.prisma.dish.update({
        where: { id },
        data: updateData,
        include: {
          restaurant: true,
          category: true,
        },
      });

      return dish;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Dish not found');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('Dish with this name already exists');
        }
      }

      console.error(error);
      throw new InternalServerErrorException('Failed to update dish');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.dish.delete({
        where: { id },
      });
      return { message: 'Dish deleted successfully' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Dish not found');
        }
      }

      console.error(error);
      throw new InternalServerErrorException('Failed to delete dish');
    }
  }
}