import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { PrismaModule } from '../../infra/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule], // PrismaModule is global, but explicit import is fine
  controllers: [ExerciseController],
  providers: [ExerciseService],
})
export class ExerciseModule {}
