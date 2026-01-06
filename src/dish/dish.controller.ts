import { Body, Controller, Post, Get, Patch, Delete, Param, UseGuards, Query } from '@nestjs/common';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { UpdateDishDto } from './dto/update-dish.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dishes')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateDishDto) {
    return this.dishService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query('restaurantId') restaurantId?: string) {
    if (restaurantId) {
      return this.dishService.findByRestaurant(restaurantId);
    }
    // Return empty array or all dishes - you decide
    return [];
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDishDto) {
    return this.dishService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dishService.remove(id);
  }
}