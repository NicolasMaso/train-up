import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateWorkoutPlanExerciseDto {
  @ApiProperty({
    description: 'ID of the Workout this exercise belongs to',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  workoutId: string;

  @ApiProperty({
    description: 'ID of the Exercise to be planned',
    example: 'f0e1d2c3-b4a5-6789-0123-456789abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  exerciseId: string;

  @ApiProperty({ description: 'Prescribed number of sets', example: 3 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  sets: number;

  @ApiProperty({ description: 'Prescribed number of repetitions', example: 12 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  reps: number;

  @ApiProperty({
    description: 'Prescribed load/weight in kg',
    example: 20.5,
    required: false,
  })
  @IsOptional()
  @Min(0)
  targetLoad?: number;

  @ApiProperty({
    description: 'Prescribed rest time in seconds',
    example: 60,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  targetRestTime?: number;

  @ApiProperty({
    description: 'Specific notes for this exercise in the plan',
    example: 'Focus on controlled movement',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Order of the exercise in the workout plan',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  order: number;
}
