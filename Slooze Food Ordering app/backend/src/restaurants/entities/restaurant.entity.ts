import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Country } from '@prisma/client';
import { MenuItem } from './menu-item.entity';

@ObjectType()
export class Restaurant {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => String)
  country: Country;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => [MenuItem], { nullable: true })
  menuItems?: MenuItem[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
