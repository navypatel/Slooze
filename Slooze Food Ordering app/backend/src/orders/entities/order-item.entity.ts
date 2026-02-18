import { ObjectType, Field, ID } from '@nestjs/graphql';
import { MenuItem } from '../../restaurants/entities/menu-item.entity';

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  id: string;

  @Field()
  orderId: string;

  @Field()
  menuItemId: string;

  @Field()
  quantity: number;

  @Field()
  price: number;

  @Field(() => MenuItem)
  menuItem: MenuItem;

  @Field()
  createdAt: Date;
}
