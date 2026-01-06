import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CitiesService {
  constructor(private prisma: PrismaService) {}

  async getRestaurantsByCitySlug(citySlug: string) {
    const city = await this.prisma.city.findUnique({
      where: { slug: citySlug },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    const restaurants = await this.prisma.restaurant.findMany({
      where: {
        city_id: city.id,
      },
      include: {
        city: true,
        stats: true,
        _count: {
          select: {
            dishes: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Sort by stats.score if available, otherwise by created_at
    return restaurants.sort((a, b) => {
      const scoreA = a.stats?.score ?? 0;
      const scoreB = b.stats?.score ?? 0;
      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Descending
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  async getDishesByCitySlugAndCategory(citySlug: string, category?: string) {
    const city = await this.prisma.city.findUnique({
      where: { slug: citySlug },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    // Get all restaurants in the city
    const restaurants = await this.prisma.restaurant.findMany({
      where: {
        city_id: city.id,
      },
      select: {
        id: true,
      },
    });

    const restaurantIds = restaurants.map((r) => r.id);

    // Build where clause
    const where: any = {
      restaurant_id: {
        in: restaurantIds,
      },
      is_active: true,
    };

    if (category) {
      where.category = category;
    }

    const dishes = await this.prisma.dish.findMany({
      where,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
            cuisine_type: true,
            city: true,
          },
        },
        stats: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Sort by stats.score and avg_rating if available
    return dishes.sort((a, b) => {
      const scoreA = a.stats?.score ?? 0;
      const scoreB = b.stats?.score ?? 0;
      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Descending by score
      }
      const ratingA = a.stats?.avg_rating ?? 0;
      const ratingB = b.stats?.avg_rating ?? 0;
      if (ratingA !== ratingB) {
        return ratingB - ratingA; // Descending by rating
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  async getCuisineRanking(citySlug: string, cuisineType: string) {
    const city = await this.prisma.city.findUnique({
      where: { slug: citySlug },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    // Get restaurants with this cuisine type in the city
    const restaurants = await this.prisma.restaurant.findMany({
      where: {
        city_id: city.id,
        cuisine_type: cuisineType,
      },
      include: {
        city: true,
        stats: true,
        dishes: {
          where: {
            is_active: true,
          },
          include: {
            stats: true,
          },
        },
        _count: {
          select: {
            dishes: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Sort by stats.score if available
    const sortedRestaurants = restaurants.sort((a, b) => {
      const scoreA = a.stats?.score ?? 0;
      const scoreB = b.stats?.score ?? 0;
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    // Calculate cuisine-level stats
    const totalReviews = sortedRestaurants.reduce(
      (sum, r) => sum + (r.stats?.total_reviews || 0),
      0,
    );
    const avgScore =
      sortedRestaurants.length > 0
        ? sortedRestaurants.reduce((sum, r) => sum + (r.stats?.score || 0), 0) /
          sortedRestaurants.length
        : 0;
    const restaurantCount = sortedRestaurants.length;

    return {
      cuisine_type: cuisineType,
      city: {
        id: city.id,
        name: city.name,
        slug: city.slug,
      },
      stats: {
        restaurant_count: restaurantCount,
        total_reviews: totalReviews,
        avg_score: avgScore,
      },
      restaurants: sortedRestaurants,
    };
  }
}