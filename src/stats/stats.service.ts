import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Recalculates and persists DishStats for a given dish
   * Called automatically when reviews are created, updated, or deleted
   */
  async updateDishStats(dishId: string): Promise<void> {
    try {
      // Get all reviews for this dish
      const reviews = await this.prisma.review.findMany({
        where: { dish_id: dishId },
        orderBy: { created_at: 'desc' },
      });

      const reviewCount = reviews.length;

      if (reviewCount === 0) {
        // No reviews - delete stats if they exist
        await this.prisma.dishStats.deleteMany({
          where: { dish_id: dishId },
        });
        return;
      }

      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = totalRating / reviewCount;

      // Get the most recent review date
      const lastReviewAt = reviews[0]?.created_at || new Date();

      // Calculate score (you can adjust this formula)
      // Example: weighted score based on rating and review count
      const score = this.calculateDishScore(avgRating, reviewCount);

      // Upsert DishStats (create or update)
      await this.prisma.dishStats.upsert({
        where: { dish_id: dishId },
        update: {
          avg_rating: avgRating,
          review_count: reviewCount,
          last_review_at: lastReviewAt,
          score: score,
          updated_at: new Date(),
        },
        create: {
          dish_id: dishId,
          avg_rating: avgRating,
          review_count: reviewCount,
          last_review_at: lastReviewAt,
          score: score,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      console.error(`Failed to update DishStats for dish ${dishId}:`, error);
      throw new InternalServerErrorException('Failed to update dish stats');
    }
  }

  /**
   * Recalculates and persists RestaurantStats for a given restaurant
   * Called automatically when dish stats are updated
   */
  async updateRestaurantStats(restaurantId: string): Promise<void> {
    try {
      // Get all dishes for this restaurant
      const dishes = await this.prisma.dish.findMany({
        where: { restaurant_id: restaurantId },
        include: {
          stats: true,
        },
      });

      const dishCount = dishes.length;

      if (dishCount === 0) {
        // No dishes - delete stats if they exist
        await this.prisma.restaurantStats.deleteMany({
          where: { restaurant_id: restaurantId },
        });
        return;
      }

      // Get dishes with stats
      const dishesWithStats = dishes.filter((dish) => dish.stats !== null);

      if (dishesWithStats.length === 0) {
        // No dishes with stats yet - delete stats if they exist
        await this.prisma.restaurantStats.deleteMany({
          where: { restaurant_id: restaurantId },
        });
        return;
      }

      // Calculate average dish score
      const totalDishScore = dishesWithStats.reduce(
        (sum, dish) => sum + (dish.stats?.score || 0),
        0,
      );
      const avgDishScore = totalDishScore / dishesWithStats.length;

      // Calculate total reviews across all dishes
      const totalReviews = dishesWithStats.reduce(
        (sum, dish) => sum + (dish.stats?.review_count || 0),
        0,
      );

      // Calculate restaurant score (you can adjust this formula)
      const score = this.calculateRestaurantScore(
        avgDishScore,
        totalReviews,
        dishCount,
      );

      // Upsert RestaurantStats (create or update)
      await this.prisma.restaurantStats.upsert({
        where: { restaurant_id: restaurantId },
        update: {
          avg_dish_score: avgDishScore,
          total_reviews: totalReviews,
          dish_count: dishCount,
          score: score,
          updated_at: new Date(),
        },
        create: {
          restaurant_id: restaurantId,
          avg_dish_score: avgDishScore,
          total_reviews: totalReviews,
          dish_count: dishCount,
          score: score,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      console.error(
        `Failed to update RestaurantStats for restaurant ${restaurantId}:`,
        error,
      );
      throw new InternalServerErrorException('Failed to update restaurant stats');
    }
  }

  /**
   * Calculate dish score based on rating and review count
   * You can customize this formula based on your ranking algorithm
   */
  private calculateDishScore(avgRating: number, reviewCount: number): number {
    // Example formula: weighted average with review count boost
    // Adjust this based on your business logic
    const baseScore = avgRating;
    const reviewBoost = Math.min(reviewCount * 0.1, 1.0); // Cap boost at 1.0
    return baseScore + reviewBoost;
  }

  /**
   * Calculate restaurant score based on dish scores, reviews, and dish count
   * You can customize this formula based on your ranking algorithm
   */
  private calculateRestaurantScore(
    avgDishScore: number,
    totalReviews: number,
    dishCount: number,
  ): number {
    // Example formula: weighted average with review and dish count boost
    // Adjust this based on your business logic
    const baseScore = avgDishScore;
    const reviewBoost = Math.min(totalReviews * 0.01, 2.0); // Cap boost at 2.0
    const dishCountBoost = Math.min(dishCount * 0.1, 1.0); // Cap boost at 1.0
    return baseScore + reviewBoost + dishCountBoost;
  }
}