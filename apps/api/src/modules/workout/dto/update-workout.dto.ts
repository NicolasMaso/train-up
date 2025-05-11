import { PartialType } from '@nestjs/swagger';
import { CreateWorkoutDto } from './create-workout.dto';
import {
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WorkoutPlanExerciseDto } from './workout-plan-exercise.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWorkoutDto extends PartialType(CreateWorkoutDto) {
  // Explicitly redefine planExercises if you need different validation or behavior on update,
  // or if PartialType doesn't handle nested array updates as desired for your logic.
  // For example, to allow replacing the entire list or sending an empty list to clear exercises.
  @ApiPropertyOptional({
    description:
      'Array of exercises to update in this workout plan. Send a new array to replace existing.',
    type: [WorkoutPlanExerciseDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(0) // Allows sending an empty array to remove all exercises
  @Type(() => WorkoutPlanExerciseDto)
  planExercises?: WorkoutPlanExerciseDto[];
}
