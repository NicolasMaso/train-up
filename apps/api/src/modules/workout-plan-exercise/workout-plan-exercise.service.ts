import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { CreateWorkoutPlanExerciseDto } from './dto/create-workout-plan-exercise.dto';
import { UpdateWorkoutPlanExerciseDto } from './dto/update-workout-plan-exercise.dto';
import { WorkoutPlanExercise } from '@prisma/client';

@Injectable()
export class WorkoutPlanExerciseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createDto: CreateWorkoutPlanExerciseDto,
  ): Promise<WorkoutPlanExercise> {
    const { workoutId, exerciseId, ...restData } = createDto;

    // Verificar se o Workout existe
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
    });
    if (!workout) {
      throw new NotFoundException(`Workout with ID "${workoutId}" not found.`);
    }

    // Verificar se o Exercise existe
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });
    if (!exercise) {
      throw new NotFoundException(
        `Exercise with ID "${exerciseId}" not found.`,
      );
    }

    return this.prisma.workoutPlanExercise.create({
      data: {
        workoutId,
        exerciseId,
        ...restData,
      },
    });
  }

  async findAllByWorkoutId(workoutId: string): Promise<WorkoutPlanExercise[]> {
    // Verificar se o Workout existe
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
    });
    if (!workout) {
      throw new NotFoundException(`Workout with ID "${workoutId}" not found.`);
    }
    return this.prisma.workoutPlanExercise.findMany({
      where: { workoutId },
      orderBy: { order: 'asc' }, // Ordenar pela ordem definida
    });
  }

  async findOne(id: string): Promise<WorkoutPlanExercise> {
    const exercisePlan = await this.prisma.workoutPlanExercise.findUnique({
      where: { id },
    });
    if (!exercisePlan) {
      throw new NotFoundException(
        `WorkoutPlanExercise with ID "${id}" not found.`,
      );
    }
    return exercisePlan;
  }

  async update(
    id: string,
    updateDto: UpdateWorkoutPlanExerciseDto,
  ): Promise<WorkoutPlanExercise> {
    // Verificar se o WorkoutPlanExercise existe
    const existingEntry = await this.prisma.workoutPlanExercise.findUnique({
      where: { id },
    });
    if (!existingEntry) {
      throw new NotFoundException(
        `WorkoutPlanExercise with ID "${id}" not found for update.`,
      );
    }

    const { workoutId, exerciseId, ...restData } = updateDto;

    if (workoutId) {
      const workout = await this.prisma.workout.findUnique({
        where: { id: workoutId },
      });
      if (!workout) {
        throw new NotFoundException(
          `Workout with ID "${workoutId}" not found.`,
        );
      }
    }

    if (exerciseId) {
      const exercise = await this.prisma.exercise.findUnique({
        where: { id: exerciseId },
      });
      if (!exercise) {
        throw new NotFoundException(
          `Exercise with ID "${exerciseId}" not found.`,
        );
      }
    }

    return this.prisma.workoutPlanExercise.update({
      where: { id },
      data: {
        workoutId,
        exerciseId,
        ...restData,
      },
    });
  }

  async remove(id: string): Promise<WorkoutPlanExercise> {
    const existingEntry = await this.prisma.workoutPlanExercise.findUnique({
      where: { id },
    });
    if (!existingEntry) {
      throw new NotFoundException(
        `WorkoutPlanExercise with ID "${id}" not found for deletion.`,
      );
    }
    return this.prisma.workoutPlanExercise.delete({ where: { id } });
  }

  async removeAllByWorkoutId(workoutId: string): Promise<{ count: number }> {
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
    });
    if (!workout) {
      throw new NotFoundException(`Workout with ID "${workoutId}" not found.`);
    }
    return this.prisma.workoutPlanExercise.deleteMany({ where: { workoutId } });
  }
}
