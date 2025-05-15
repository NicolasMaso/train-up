import { PartialType } from '@nestjs/swagger';
import { CreateWorkoutSessionDto } from './create-workout-session.dto';

export class UpdateWorkoutSessionDto extends PartialType(
  CreateWorkoutSessionDto,
) {}
