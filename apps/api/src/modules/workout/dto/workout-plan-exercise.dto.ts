import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class WorkoutPlanExerciseDto {
  @ApiProperty({
    description: 'ID of the specific exercise from the main Exercise table',
  })
  @IsUUID()
  @IsNotEmpty()
  exerciseId: string;

  @ApiProperty({ description: 'Prescribed number of sets', example: 3 })
  @IsInt()
  @Min(1)
  sets: number;

  @ApiProperty({
    description: 'Prescribed number of repetitions per set',
    example: 10,
  })
  @IsInt()
  @Min(1)
  reps: number;

  @ApiPropertyOptional({
    description: 'Prescribed load/weight in kg (optional)',
    example: 50,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  targetLoad?: number;

  @ApiPropertyOptional({
    description: 'Prescribed rest time in seconds (optional)',
    example: 60,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  targetRestTime?: number;

  @ApiPropertyOptional({
    description: 'Specific notes for this exercise in the plan',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;

  @ApiProperty({
    description: 'Order of this exercise in the workout plan',
    example: 1,
  })
  @IsInt()
  @Min(0) // Or Min(1) if you prefer 1-based indexing for order
  order: number;
}
