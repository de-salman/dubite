import { Module } from '@nestjs/common';
import { CuisineController } from './cuisine.controller';
import { CuisineService } from './cuisine.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CuisineController],
  providers: [CuisineService],
  exports: [CuisineService],
})
export class CuisineModule {}
