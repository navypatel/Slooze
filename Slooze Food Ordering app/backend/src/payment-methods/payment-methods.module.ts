import { Module } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsResolver } from './payment-methods.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PaymentMethodsService, PaymentMethodsResolver],
  exports: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
