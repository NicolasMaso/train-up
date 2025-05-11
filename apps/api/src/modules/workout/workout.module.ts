import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { PrismaModule } from '../../infra/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule], // PrismaModule is global, but explicit import is fine
  controllers: [WorkoutController],
  providers: [WorkoutService],
})
export class WorkoutModule {}
