import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { StatsModule } from 'src/stats/stats.module';

@Module({
  imports: [PrismaModule, AuthModule, StatsModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}