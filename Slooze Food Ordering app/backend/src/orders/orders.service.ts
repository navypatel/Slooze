import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { OrderStatus, Country } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, input: CreateOrderInput): Promise<Order> {
    // Verify restaurant exists and get its country
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: input.restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Verify user can access this restaurant (country check)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.role !== 'ADMIN' && user.country !== restaurant.country) {
      throw new ForbiddenException(
        `You can only order from restaurants in ${user.country}`,
      );
    }

    // Calculate total
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: input.items.map((item) => item.menuItemId) },
        restaurantId: input.restaurantId,
      },
    });

    let totalAmount = 0;
    const orderItems = input.items.map((item) => {
      const menuItem = menuItems.find((mi) => mi.id === item.menuItemId);
      if (!menuItem) {
        throw new NotFoundException(`MenuItem ${item.menuItemId} not found`);
      }
      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
      };
    });

    // Create order
    const order = await this.prisma.order.create({
      data: {
        userId,
        restaurantId: input.restaurantId,
        status: OrderStatus.PENDING,
        totalAmount,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
        user: true,
      },
    });

    return order as any;
  }

  async checkout(orderId: string, userId: string, paymentMethodId: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { restaurant: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You can only checkout your own orders');
    }

    // Verify country access
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.role !== 'ADMIN' && user.country !== order.restaurant.country) {
      throw new ForbiddenException('Access denied');
    }

    // Verify payment method belongs to user
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    });

    if (!paymentMethod || paymentMethod.userId !== userId) {
      throw new ForbiddenException('Invalid payment method');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CONFIRMED,
        paymentMethodId,
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
        user: true,
        paymentMethod: true,
      },
    });

    return updatedOrder as any;
  }

  async cancel(orderId: string, userId: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { restaurant: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own orders');
    }

    // Verify country access
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.role !== 'ADMIN' && user.country !== order.restaurant.country) {
      throw new ForbiddenException('Access denied');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new ForbiddenException('Order is already cancelled');
    }

    if (order.status === OrderStatus.COMPLETED) {
      throw new ForbiddenException('Cannot cancel a completed order');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
        user: true,
      },
    });

    return updatedOrder as any;
  }

  async findAll(userId: string, userCountry?: Country): Promise<Order[]> {
    const where: any = { userId };
    
    if (userCountry) {
      where.restaurant = { country: userCountry };
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
        user: true,
        paymentMethod: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders as any;
  }

  async findOne(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
        user: true,
        paymentMethod: true,
      },
    });
  }
}
