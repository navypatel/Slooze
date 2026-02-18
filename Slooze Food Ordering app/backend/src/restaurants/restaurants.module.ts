import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsResolver } from './restaurants.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RestaurantsService, RestaurantsResolver],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
