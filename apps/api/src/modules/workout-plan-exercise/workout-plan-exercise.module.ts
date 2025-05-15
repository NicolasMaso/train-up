import { Module } from '@nestjs/common';
import { WorkoutPlanExerciseService } from './workout-plan-exercise.service';
import { WorkoutPlanExerciseController } from './workout-plan-exercise.controller';
import { PrismaModule } from '../../infra/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WorkoutPlanExerciseController],
  providers: [WorkoutPlanExerciseService],
  exports: [WorkoutPlanExerciseService],
})
export class WorkoutPlanExerciseModule {}
