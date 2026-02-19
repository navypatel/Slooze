import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreatePaymentMethodInput {
  @Field()
  @IsString()
  type: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cardNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cardHolder?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  expiryDate?: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  isDefault: boolean;
}
