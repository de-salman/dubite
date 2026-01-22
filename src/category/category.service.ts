import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.create({
        data: {
          name: dto.name,
          slug: dto.name.toLowerCase().replace(/\s+/g, '-'),
          image_url: dto.image_url,
        },
      });

      return category;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Category with this name already exists');
        }
      }

      console.error(error);
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            dishes: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    try {
      const updateData: any = {};

      if (dto.name !== undefined) {
        updateData.name = dto.name;
        updateData.slug = dto.name.toLowerCase().replace(/\s+/g, '-');
      }
      if (dto.image_url !== undefined) updateData.image_url = dto.image_url;

      const category = await this.prisma.category.update({
        where: { id },
        data: updateData,
      });

      return category;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Category not found');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('Category with this name already exists');
        }
      }

      console.error(error);
      throw new InternalServerErrorException('Failed to update category');
    }
  }

  async remove(id: string) {
    try {
      // Check if category is used by any dishes
      const dishCount = await this.prisma.dish.count({
        where: {
          category_id: id,
        },
      });

      if (dishCount > 0) {
        throw new BadRequestException(
          `Cannot delete category. It is used by ${dishCount} dish(es).`
        );
      }

      await this.prisma.category.delete({
        where: { id },
      });

      return { message: 'Category deleted successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Category not found');
        }
      }

      console.error(error);
      throw new InternalServerErrorException('Failed to delete category');
    }
  }
}
