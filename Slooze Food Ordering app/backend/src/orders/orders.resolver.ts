import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Role } from '@prisma/client';

@Resolver(() => Order)
@UseGuards(JwtAuthGuard)
export class OrdersResolver {
  constructor(private ordersService: OrdersService) {}

  @Mutation(() => Order)
  async createOrder(
    @Args('input') input: CreateOrderInput,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.create(user.id, input);
  }

  @Mutation(() => Order)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async checkout(
    @Args('orderId') orderId: string,
    @Args('paymentMethodId') paymentMethodId: string,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.checkout(orderId, user.id, paymentMethodId);
  }

  @Mutation(() => Order)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async cancelOrder(
    @Args('orderId') orderId: string,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.cancel(orderId, user.id);
  }

  @Query(() => [Order])
  async myOrders(@CurrentUser() user: User) {
    const userCountry = user.role === 'ADMIN' ? undefined : user.country;
    return this.ordersService.findAll(user.id, userCountry);
  }

  @Query(() => Order, { nullable: true })
  async order(@Args('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
