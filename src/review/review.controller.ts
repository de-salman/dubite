import {
    Body,
    Controller,
    Post,
    Patch,
    Param,
    UseGuards,
    Request,
    Delete,
    Get,
  } from '@nestjs/common';
  import { ReviewService } from './review.service';
  import { CreateReviewDto } from './dto/create-review.dto';
  import { UpdateReviewDto } from './dto/update-review.dto';
  import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/auth/guards/roles.guard';
  import { Roles } from 'src/auth/decorators/roles.decorator';
  import { Role } from 'src/auth/roles.enum';
  
  @Controller('reviews')
  export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}
  
    // Public endpoint - no auth required
    @Get('featured')
    getFeatured() {
      return this.reviewService.findFeatured();
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER)
    @Post()
    create(@Request() req, @Body() dto: CreateReviewDto) {
      const userId = req.user.sub; // Get user ID from JWT payload
      return this.reviewService.create(userId, dto);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER)
    @Patch(':id')
    update(
      @Request() req,
      @Param('id') id: string,
      @Body() dto: UpdateReviewDto,
    ) {
      const userId = req.user.sub; // Get user ID from JWT payload
      return this.reviewService.update(userId, id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER)
    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
      const userId = req.user.sub; // Get user ID from JWT payload
      return this.reviewService.remove(userId, id);
    }
  }