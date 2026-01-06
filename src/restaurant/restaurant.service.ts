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
      const restaurant = await this.prisma.restaurant.create({
        data: {
          name: dto.name,
          description: dto.description,
          tags: dto.tags,
          cuisine_type: dto.cuisine_type,
          latitude: dto.latitude,
          longitude: dto.longitude,
          slug: dto.name.toLowerCase().replace(/\s+/g, '-'),
          city: { connect: { id: dto.city_id } },
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
      },
      orderBy: {
        created_at: 'desc',
      },
    });
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
      if (dto.cuisine_type !== undefined) updateData.cuisine_type = dto.cuisine_type;
      if (dto.latitude !== undefined) updateData.latitude = dto.latitude;
      if (dto.longitude !== undefined) updateData.longitude = dto.longitude;
      if (dto.city_id !== undefined) {
        updateData.city = { connect: { id: dto.city_id } };
      }

      const restaurant = await this.prisma.restaurant.update({
        where: { id },
        data: updateData,
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
