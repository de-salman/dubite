import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { CreateReviewDto } from './dto/create-review.dto';
  import { UpdateReviewDto } from './dto/update-review.dto';
  import { PrismaService } from 'src/prisma/prisma.service';
  import { StatsService } from 'src/stats/stats.service';
  import { Prisma } from '@prisma/client';
  
  @Injectable()
  export class ReviewService {
    constructor(
      private prisma: PrismaService,
      private statsService: StatsService,
    ) {}
  
    async create(userId: string, dto: CreateReviewDto) {
      try {
        // Check if dish exists
        const dish = await this.prisma.dish.findUnique({
          where: { id: dto.dish_id },
          include: {
            restaurant: true,
          },
        });
  
        if (!dish) {
          throw new NotFoundException('Dish not found');
        }
  
        // Check if user already reviewed this dish
        const existingReview = await this.prisma.review.findUnique({
          where: {
            user_id_dish_id: {
              user_id: userId,
              dish_id: dto.dish_id,
            },
          },
        });
  
        if (existingReview) {
          throw new BadRequestException('You have already reviewed this dish');
        }
  
        // Create review
        const review = await this.prisma.review.create({
          data: {
            user_id: userId,
            dish_id: dto.dish_id,
            rating: dto.rating,
            comment: dto.comment,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            dish: {
              include: {
                restaurant: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });
  
        // Trigger DishStats recalculation
        await this.statsService.updateDishStats(dto.dish_id);
  
        // Trigger RestaurantStats recalculation
        await this.statsService.updateRestaurantStats(dish.restaurant_id);
  
        return review;
      } catch (error) {
        if (
          error instanceof NotFoundException ||
          error instanceof BadRequestException
        ) {
          throw error;
        }
  
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new BadRequestException('You have already reviewed this dish');
          }
          if (error.code === 'P2025') {
            throw new NotFoundException('Dish not found');
          }
        }
  
        console.error(error);
        throw new InternalServerErrorException('Failed to create review');
      }
    }
  
    async update(userId: string, reviewId: string, dto: UpdateReviewDto) {
      try {
        // Check if review exists and belongs to user
        const existingReview = await this.prisma.review.findUnique({
          where: { id: reviewId },
          include: {
            dish: {
              include: {
                restaurant: true,
              },
            },
          },
        });
  
        if (!existingReview) {
          throw new NotFoundException('Review not found');
        }
  
        if (existingReview.user_id !== userId) {
          throw new BadRequestException('You can only update your own reviews');
        }
  
        // Build update data
        const updateData: any = {};
        if (dto.rating !== undefined) updateData.rating = dto.rating;
        if (dto.comment !== undefined) updateData.comment = dto.comment;
  
        // Update review
        const review = await this.prisma.review.update({
          where: { id: reviewId },
          data: updateData,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            dish: {
              include: {
                restaurant: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });
  
        // Trigger DishStats recalculation
        await this.statsService.updateDishStats(existingReview.dish_id);
  
        // Trigger RestaurantStats recalculation
        await this.statsService.updateRestaurantStats(existingReview.dish.restaurant_id);
  
        return review;
      } catch (error) {
        if (
          error instanceof NotFoundException ||
          error instanceof BadRequestException
        ) {
          throw error;
        }
  
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new NotFoundException('Review not found');
          }
        }
  
        console.error(error);
        throw new InternalServerErrorException('Failed to update review');
      }
    }
  
    async remove(userId: string, reviewId: string) {
      try {
        // Check if review exists and belongs to user
        const existingReview = await this.prisma.review.findUnique({
          where: { id: reviewId },
          include: {
            dish: {
              include: {
                restaurant: true,
              },
            },
          },
        });
  
        if (!existingReview) {
          throw new NotFoundException('Review not found');
        }
  
        if (existingReview.user_id !== userId) {
          throw new BadRequestException('You can only delete your own reviews');
        }
  
        const dishId = existingReview.dish_id;
        const restaurantId = existingReview.dish.restaurant_id;
  
        // Delete review
        await this.prisma.review.delete({
          where: { id: reviewId },
        });
  
        // Trigger DishStats recalculation
        await this.statsService.updateDishStats(dishId);
  
        // Trigger RestaurantStats recalculation
        await this.statsService.updateRestaurantStats(restaurantId);
  
        return { message: 'Review deleted successfully' };
      } catch (error) {
        if (
          error instanceof NotFoundException ||
          error instanceof BadRequestException
        ) {
          throw error;
        }
  
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new NotFoundException('Review not found');
          }
        }
  
        console.error(error);
        throw new InternalServerErrorException('Failed to delete review');
      }
    }
  }