import { ApiProperty } from '@nestjs/swagger';

export class PhysicalAssessmentEntity {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000000' })
  id: string;

  @ApiProperty({ example: '2025-05-14T10:00:00.000Z' })
  date: Date;

  @ApiProperty({ example: 'Body composition analysis and strength test.' })
  description: string;

  @ApiProperty({ example: 75 })
  weight: number;

  @ApiProperty({ example: 15 })
  bodyFatPercentage: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
