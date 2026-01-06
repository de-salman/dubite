import { Controller, Get, Param, Query } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get(':slug/restaurants')
  getRestaurantsByCity(@Param('slug') slug: string) {
    return this.citiesService.getRestaurantsByCitySlug(slug);
  }

  @Get(':slug/dishes')
  getDishesByCity(
    @Param('slug') slug: string,
    @Query('category') category?: string,
  ) {
    return this.citiesService.getDishesByCitySlugAndCategory(slug, category);
  }

  @Get(':slug/cuisines/:type')
  getCuisineRanking(
    @Param('slug') slug: string,
    @Param('type') type: string,
  ) {
    return this.citiesService.getCuisineRanking(slug, type);
  }
}