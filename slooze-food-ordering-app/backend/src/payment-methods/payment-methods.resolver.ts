import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethod } from './entities/payment-method.entity';
import { CreatePaymentMethodInput } from './dto/create-payment-method.input';
import { UpdatePaymentMethodInput } from './dto/update-payment-method.input';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Role } from '@prisma/client';

@Resolver(() => PaymentMethod)
@UseGuards(JwtAuthGuard)
export class PaymentMethodsResolver {
  constructor(private paymentMethodsService: PaymentMethodsService) {}

  @Mutation(() => PaymentMethod)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async createPaymentMethod(
    @Args('input') input: CreatePaymentMethodInput,
    @CurrentUser() user: User,
  ) {
    return this.paymentMethodsService.create(user.id, input);
  }

  @Mutation(() => PaymentMethod)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async updatePaymentMethod(
    @Args('id') id: string,
    @Args('input') input: UpdatePaymentMethodInput,
    @CurrentUser() user: User,
  ) {
    return this.paymentMethodsService.update(id, user.id, input);
  }

  @Query(() => [PaymentMethod])
  async myPaymentMethods(@CurrentUser() user: User) {
    return this.paymentMethodsService.findAll(user.id);
  }

  @Query(() => PaymentMethod, { nullable: true })
  async paymentMethod(@Args('id') id: string) {
    return this.paymentMethodsService.findOne(id);
  }
}
