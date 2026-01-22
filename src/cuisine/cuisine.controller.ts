import { Body, Controller, Post, Get, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { CuisineService } from './cuisine.service';
import { CreateCuisineDto } from './dto/create-cuisine.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { UpdateCuisineDto } from './dto/update-cuisine.dto';

@Controller('cuisines')
export class CuisineController {
  constructor(private readonly cuisineService: CuisineService) {}

  @Get()
  findAll() {
    return this.cuisineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cuisineService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateCuisineDto) {
    return this.cuisineService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCuisineDto) {
    return this.cuisineService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cuisineService.remove(id);
  }
}
