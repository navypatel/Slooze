import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PaymentMethod {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  type: string;

  @Field({ nullable: true })
  cardNumber?: string;

  @Field({ nullable: true })
  cardHolder?: string;

  @Field({ nullable: true })
  expiryDate?: string;

  @Field()
  isDefault: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
