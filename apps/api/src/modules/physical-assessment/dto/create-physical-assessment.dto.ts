import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';

export class CreatePhysicalAssessmentDto {
  @ApiProperty({ description: 'User ID to associate the assessment with' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'Date of the assessment' })
  @IsOptional()
  @IsDateString()
  date?: Date;

  @ApiPropertyOptional({ description: 'Weight in kilograms' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weightKg?: number;

  @ApiPropertyOptional({ description: 'Height in centimeters' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  heightCm?: number;

  @ApiPropertyOptional({ description: 'Body fat percentage' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bodyFatPercentage?: number;

  @ApiPropertyOptional({ description: 'Waist circumference in centimeters' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  waistCm?: number;

  @ApiPropertyOptional({ description: 'Hip circumference in centimeters' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hipCm?: number;

  @ApiPropertyOptional({ description: 'Chest circumference in centimeters' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  chestCm?: number;

  @ApiPropertyOptional({ description: 'Left arm circumference in centimeters' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  armLeftCm?: number;

  @ApiPropertyOptional({
    description: 'Right arm circumference in centimeters',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  armRightCm?: number;

  @ApiPropertyOptional({ description: 'Left leg circumference in centimeters' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  legLeftCm?: number;

  @ApiPropertyOptional({
    description: 'Right leg circumference in centimeters',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  legRightCm?: number;

  @ApiPropertyOptional({
    description: 'Anamnesis details (can be a JSON string)',
  })
  @IsOptional()
  @IsString()
  anamnesis?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
