import { ApiProperty } from '@nestjs/swagger';
import {
  Subscription as PrismaSubscription,
  PaymentStatus,
} from '@prisma/client';

export class SubscriptionEntity implements PrismaSubscription {
  @ApiProperty({
    example: 'clx3x2y8z0000a8c0b1d2e3f4',
    description: 'ID único da assinatura',
  })
  id: string;

  @ApiProperty({
    example: 'Plano Premium Anual',
    description: 'Nome do plano de assinatura',
  })
  planName: string;

  @ApiProperty({ example: 199.9, description: 'Valor do plano' })
  planValue: number;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Data de início da assinatura',
  })
  startDate: Date;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Data de término da assinatura',
  })
  endDate: Date;

  @ApiProperty({
    example: '2025-01-05T00:00:00.000Z',
    description: 'Data do pagamento',
    required: false,
    nullable: true,
  })
  paymentDate: Date | null;

  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.PAID,
    description: 'Status do pagamento',
  })
  paymentStatus: PaymentStatus;

  @ApiProperty({
    example: 'Assinatura referente ao ano de 2025.',
    description: 'Notas adicionais sobre a assinatura',
    required: false,
    nullable: true,
  })
  notes: string | null;

  @ApiProperty({
    example: 'clx3x2y8z0001a8c0g5h6i7j8',
    description: 'ID do usuário associado à assinatura',
  })
  userId: string;

  @ApiProperty({ description: 'Data de criação do registro' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização do registro' })
  updatedAt: Date;

  constructor(partial: Partial<SubscriptionEntity>) {
    Object.assign(this, partial);
  }
}
