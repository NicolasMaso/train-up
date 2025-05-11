import { Module } from '@nestjs/common';
import { ExerciseGroupService } from './exercise-group.service';
import { ExerciseGroupController } from './exercise-group.controller';
import { PrismaModule } from '../../infra/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExerciseGroupController],
  providers: [ExerciseGroupService],
})
export class ExerciseGroupModule {}
