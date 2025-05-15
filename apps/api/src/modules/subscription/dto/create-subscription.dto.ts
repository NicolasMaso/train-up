import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 'Plano Mensal', description: 'Nome do plano' })
  @IsString()
  @IsNotEmpty()
  planName: string;

  @ApiProperty({ example: 99.9, description: 'Valor do plano' })
  @IsNumber()
  @Min(0)
  planValue: number;

  @ApiProperty({
    example: '2025-06-01T00:00:00.000Z',
    description: 'Data de início da assinatura',
  })
  @IsDateString()
  startDate: string; // Prisma espera string para DateTime

  @ApiProperty({
    example: '2026-06-01T00:00:00.000Z',
    description: 'Data de término da assinatura',
  })
  @IsDateString()
  endDate: string; // Prisma espera string para DateTime

  @ApiProperty({
    example: '2025-06-05T00:00:00.000Z',
    description: 'Data do pagamento',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
    description: 'Status do pagamento',
    required: false,
    default: PaymentStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiProperty({
    example: 'Pagamento via PIX',
    description: 'Notas adicionais',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  // userId será adicionado pelo serviço com base no usuário autenticado
}
