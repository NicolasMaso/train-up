import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { PrismaModule } from '../infra/database/prisma/prisma.module';
import { PhysicalAssessmentModule } from './physical-assessment/physical-assessment.module';
import { ConfigModule } from '@nestjs/config';
import { WorkoutModule } from './workout/workout.module';
import { ExerciseGroupModule } from './exercise-group/exercise-group.module';
import { ExerciseModule } from './exercise/exercise.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { SubscriptionModule } from './subscription/subscription.module';
import { WorkoutPlanExerciseModule } from './workout-plan-exercise/workout-plan-exercise.module';
import { WorkoutSessionModule } from './workout-session/workout-session.module';

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
    UserModule,
    AuthModule,
    SubscriptionModule,
    WorkoutPlanExerciseModule,
    WorkoutSessionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
