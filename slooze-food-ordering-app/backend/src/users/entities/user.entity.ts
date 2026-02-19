import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role, Country } from '@prisma/client';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => String)
  role: Role;

  @Field(() => String, { nullable: true })
  country?: Country;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
