import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateSubscriptionDto } from './create-subscription.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
  @ApiProperty({
    description:
      'ID do usuário (opcional ao atualizar, apenas se for para transferir a assinatura)',
    example: '0289a796-0150-4351-9bs0-9109t7gf27s2',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
