import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('restaurant')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {}
    
    @Roles(Role.ADMIN)
    @Post()
    create(@Body() dto: CreateRestaurantDto) {
      return this.restaurantService.create(dto);
    }

    @Roles(Role.ADMIN)
    @Get()
    findAll() {
      return this.restaurantService.findAll();
    }

    @Roles(Role.ADMIN)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateRestaurantDto) {
      return this.restaurantService.update(id, dto);
    }

    @Roles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.restaurantService.remove(id);
    }
  }
