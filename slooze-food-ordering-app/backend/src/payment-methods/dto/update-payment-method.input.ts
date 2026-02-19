import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreatePaymentMethodInput } from './create-payment-method.input';

@InputType()
export class UpdatePaymentMethodInput extends PartialType(CreatePaymentMethodInput) {}
