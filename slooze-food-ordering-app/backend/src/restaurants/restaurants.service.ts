import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Restaurant } from './entities/restaurant.entity';
import { MenuItem } from './entities/menu-item.entity';
import { Country } from '@prisma/client';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userCountry?: Country): Promise<Restaurant[]> {
    if (userCountry) {
      return this.prisma.restaurant.findMany({
        where: { country: userCountry },
        include: { menuItems: true },
      });
    }
    return this.prisma.restaurant.findMany({
      include: { menuItems: true },
    });
  }

  async findOne(id: string): Promise<Restaurant | null> {
    return this.prisma.restaurant.findUnique({
      where: { id },
      include: { menuItems: true },
    });
  }

  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    return this.prisma.menuItem.findMany({
      where: { restaurantId },
    });
  }
}
