import { ApiProperty } from '@nestjs/swagger';
import { WorkoutPlanExercise as PrismaWorkoutPlanExercise } from '@prisma/client';

export class WorkoutPlanExerciseEntity implements PrismaWorkoutPlanExercise {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  id: string;

  @ApiProperty({ example: 3 })
  sets: number;

  @ApiProperty({ example: 12 })
  reps: number;

  @ApiProperty({ example: 20.5, nullable: true })
  targetLoad: number | null;

  @ApiProperty({ example: 60, nullable: true })
  targetRestTime: number | null;

  @ApiProperty({ example: 'Focus on controlled movement', nullable: true })
  notes: string | null;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty({ example: 'f0e1d2c3-b4a5-6789-0123-456789abcdef' })
  workoutId: string;

  @ApiProperty({ example: 'g7h8i9j0-k1l2-3456-7890-123456abcdef' })
  exerciseId: string;

  constructor(partial: Partial<WorkoutPlanExerciseEntity>) {
    Object.assign(this, partial);
  }
}
