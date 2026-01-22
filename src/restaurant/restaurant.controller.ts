import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Controller('restaurants')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {}
    
    // Public endpoint to get restaurant by slug
    @Get('slug/:slug')
    findBySlug(@Param('slug') slug: string) {
      return this.restaurantService.findBySlug(slug);
    }

    // Public endpoint to get restaurant details by slug
    @Get('slug/:slug/details')
    findDetailBySlug(@Param('slug') slug: string) {
      return this.restaurantService.findDetailBySlug(slug);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    create(@Body() dto: CreateRestaurantDto) {
      return this.restaurantService.create(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    findAll() {
      return this.restaurantService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateRestaurantDto) {
      return this.restaurantService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.restaurantService.remove(id);
    }
  }
