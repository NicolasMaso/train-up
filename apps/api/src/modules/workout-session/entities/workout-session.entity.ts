import { ApiProperty } from '@nestjs/swagger';
import {
  $Enums,
  WorkoutSession as PrismaWorkoutSession,
  WorkoutSessionExercise as PrismaWorkoutSessionExercise,
} from '@prisma/client';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { WorkoutEntity } from 'src/modules/workout/entities/workout.entity';

// Corrige a estrutura da classe WorkoutSessionExerciseEntity
export class WorkoutSessionExerciseEntity
  implements PrismaWorkoutSessionExercise
{
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000000' })
  id: string;

  @ApiProperty({ example: '00000000-0000-0000-0000-000000000000' })
  workoutSessionId: string;

  @ApiProperty({ example: '00000000-0000-0000-0000-000000000000' })
  exerciseId: string;

  @ApiProperty({ example: 3 })
  sets: number;

  @ApiProperty({ example: 10 })
  reps: number;

  @ApiProperty({ example: 50, nullable: true })
  weight: number | null;

  @ApiProperty({ example: 60, nullable: true })
  restTime: number | null;

  @ApiProperty({ example: 'Good form', nullable: true })
  description: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

// Corrige a entidade WorkoutSessionEntity
export class WorkoutSessionEntity implements PrismaWorkoutSession {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000000' })
  id: string;

  @ApiProperty({ example: '00000000-0000-0000-0000-000000000000' })
  userId: string;

  @ApiProperty({ example: '00000000-0000-0000-0000-000000000000' })
  workoutId: string;

  @ApiProperty({ example: '2024-07-21T10:00:00.000Z' })
  startedAt: Date | null;

  @ApiProperty({ example: '2024-07-21T11:00:00.000Z', nullable: true })
  endedAt: Date | null;

  @ApiProperty({ example: 'Great session!', nullable: true })
  notes: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => UserEntity, required: false })
  user?: UserEntity | null;

  @ApiProperty({ type: () => WorkoutEntity, required: false })
  workout?: WorkoutEntity | null;

  @ApiProperty({ type: () => [WorkoutSessionExerciseEntity], required: false })
  exercises?: WorkoutSessionExerciseEntity[];

  @ApiProperty({ example: '2025-05-14T10:00:00.000Z' })
  date: Date;

  @ApiProperty({ example: 60 })
  duration: number;

  @ApiProperty({ example: 'Felt great!', nullable: true })
  feedback: string | null;

  @ApiProperty({ example: 'HIGH' })
  intensity: $Enums.WorkoutSessionIntensity;

  // Adiciona propriedades adicionais, se necessário
  @ApiProperty({ example: 'Morning session', nullable: true })
  sessionName?: string | null; // Nome opcional para a sessão

  @ApiProperty({ example: true })
  isCompleted?: boolean; // Indica se a sessão foi concluída
}
