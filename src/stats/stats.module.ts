import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
