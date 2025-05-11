import { PartialType } from '@nestjs/swagger';
import { CreateExerciseGroupDto } from './create-exercise-group.dto';

export class UpdateExerciseGroupDto extends PartialType(
  CreateExerciseGroupDto,
) {}
