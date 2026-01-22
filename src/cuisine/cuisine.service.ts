import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCuisineDto } from './dto/create-cuisine.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateCuisineDto } from './dto/update-cuisine.dto';

@Injectable()
export class CuisineService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCuisineDto) {
    try {
      const cuisine = await this.prisma.cuisine.create({
        data: {
          name: dto.name,
          slug: dto.name.toLowerCase().replace(/\s+/g, '-'),
          image_url: dto.image_url,
        },
      });

      return cuisine;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Cuisine with this name already exists');
        }
      }

      console.error(error);
      throw new InternalServerErrorException('Failed to create cuisine');
    }
  }

  async findAll() {
    return this.prisma.cuisine.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const cuisine = await this.prisma.cuisine.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            restaurants: true,
          },
        },
      },
    });

    if (!cuisine) {
      throw new NotFoundException('Cuisine not found');
    }

    return cuisine;
  }

  async update(id: string, dto: UpdateCuisineDto) {
    try {
      const updateData: any = {};

      if (dto.name !== undefined) {
        updateData.name = dto.name;
        updateData.slug = dto.name.toLowerCase().replace(/\s+/g, '-');
      }
      if (dto.image_url !== undefined) updateData.image_url = dto.image_url;

      const cuisine = await this.prisma.cuisine.update({
        where: { id },
        data: updateData,
      });

      return cuisine;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Cuisine not found');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('Cuisine with this name already exists');
        }
      }

      console.error(error);
      throw new InternalServerErrorException('Failed to update cuisine');
    }
  }

  async remove(id: string) {
    try {
      // Check if cuisine is used by any restaurants
      const restaurantCount = await this.prisma.restaurant.count({
        where: {
          cuisine_id: id,
        },
      });

      if (restaurantCount > 0) {
        throw new BadRequestException(
          `Cannot delete cuisine. It is used by ${restaurantCount} restaurant(s).`
        );
      }

      await this.prisma.cuisine.delete({
        where: { id },
      });

      return { message: 'Cuisine deleted successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Cuisine not found');
        }
      }

      console.error(error);
      throw new InternalServerErrorException('Failed to delete cuisine');
    }
  }
}
