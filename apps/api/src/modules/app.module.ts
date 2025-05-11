import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { PrismaModule } from '../infra/database/prisma/prisma.module';
import { PhysicalAssessmentModule } from './physical-assessment/physical-assessment.module';
import { ConfigModule } from '@nestjs/config';
import { WorkoutModule } from './workout/workout.module';
import { ExerciseGroupModule } from './exercise-group/exercise-group.module';
import { ExerciseModule } from './exercise/exercise.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    PhysicalAssessmentModule,
    WorkoutModule,
    ExerciseGroupModule,
    ExerciseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
