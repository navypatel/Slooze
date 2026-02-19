import { ObjectType, Field, ID } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';
import { OrderItem } from './order-item.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { User } from '../../users/entities/user.entity';
import { PaymentMethod } from '../../payment-methods/entities/payment-method.entity';

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  restaurantId: string;

  @Field(() => String)
  status: OrderStatus;

  @Field()
  totalAmount: number;

  @Field({ nullable: true })
  paymentMethodId?: string;

  @Field(() => [OrderItem])
  items: OrderItem[];

  @Field(() => Restaurant)
  restaurant: Restaurant;

  @Field(() => User)
  user: User;

  @Field(() => PaymentMethod, { nullable: true })
  paymentMethod?: PaymentMethod;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
