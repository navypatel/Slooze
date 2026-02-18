import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { Country } from '@prisma/client';

@Injectable()
export class CountryGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    if (!user) {
      return false;
    }

    // Admin can access all countries
    if (user.role === 'ADMIN') {
      return true;
    }

    // Managers and Members can only access their own country
    if (user.role === 'MANAGER' || user.role === 'MEMBER') {
      const args = ctx.getArgs();
      const country = args.country || args.input?.country || args.restaurantId 
        ? await this.getCountryFromArgs(ctx) 
        : null;

      if (country && user.country !== country) {
        throw new ForbiddenException(
          `Access denied. You can only access data for ${user.country}`,
        );
      }
    }

    return true;
  }

  private async getCountryFromArgs(ctx: GqlExecutionContext): Promise<Country | null> {
    const args = ctx.getArgs();
    
    // If country is directly provided
    if (args.country) {
      return args.country;
    }

    // If restaurantId is provided, get country from restaurant
    if (args.restaurantId) {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: args.restaurantId },
        select: { country: true },
      });
      return restaurant?.country || null;
    }

    // If orderId is provided, get country from order's restaurant
    if (args.orderId) {
      const order = await this.prisma.order.findUnique({
        where: { id: args.orderId },
        include: { restaurant: { select: { country: true } } },
      });
      return order?.restaurant?.country || null;
    }

    return null;
  }
}
