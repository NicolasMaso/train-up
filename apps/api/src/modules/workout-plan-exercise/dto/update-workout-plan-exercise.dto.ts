import { PartialType } from '@nestjs/swagger';
import { CreateWorkoutPlanExerciseDto } from './create-workout-plan-exercise.dto';

export class UpdateWorkoutPlanExerciseDto extends PartialType(
  CreateWorkoutPlanExerciseDto,
) {}
