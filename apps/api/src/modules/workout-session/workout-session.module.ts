import { Module } from '@nestjs/common';
import { WorkoutSessionService } from './workout-session.service';
import { WorkoutSessionController } from './workout-session.controller';
import { PrismaModule } from '../../infra/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WorkoutSessionController],
  providers: [WorkoutSessionService],
  exports: [WorkoutSessionService],
})
export class WorkoutSessionModule {}
