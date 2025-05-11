import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsInt,
  Min,
  IsEnum,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer'; // Required for ValidateNested
import { WorkoutLevel } from '@prisma/client';
import { WorkoutPlanExerciseDto } from './workout-plan-exercise.dto';

export class CreateWorkoutDto {
  @ApiProperty({
    description: 'Title of the workout plan',
    example: 'Full Body Strength A',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'User ID this workout plan is for (student)',
  })
  @IsOptional()
  @IsUUID()
  userId?: string; // Optional: Plan might be a template initially

  @ApiPropertyOptional({
    description: 'Detailed description of the workout plan',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Start date of the workout plan' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string; // Using string to align with IsDateString, will be Date in service

  @ApiPropertyOptional({
    description: 'End date of the workout plan (optional)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Frequency of the workout per week (optional)',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  frequency?: number;

  @ApiPropertyOptional({
    enum: WorkoutLevel,
    description: 'Difficulty level of the workout',
  })
  @IsOptional()
  @IsEnum(WorkoutLevel)
  level?: WorkoutLevel;

  @ApiPropertyOptional({
    description: 'Array of exercises included in this workout plan',
    type: [WorkoutPlanExerciseDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(0) // Can be 0 if a plan can be created without exercises initially
  @Type(() => WorkoutPlanExerciseDto)
  planExercises?: WorkoutPlanExerciseDto[];
}
