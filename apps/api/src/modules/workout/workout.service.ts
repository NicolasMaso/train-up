import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { Workout, Prisma, User } from '@prisma/client';

@Injectable()
export class WorkoutService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    const { userId, planExercises, startDate, endDate, ...workoutData } =
      createWorkoutDto;

    if (userId) {
      const user: User | null = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID "${userId}" not found.`);
      }
    }

    // Validate all exerciseIds in planExercises exist
    if (planExercises && planExercises.length > 0) {
      const exerciseIds = planExercises.map((pe) => pe.exerciseId);
      const existingExercises = await this.prisma.exercise.findMany({
        where: { id: { in: exerciseIds } },
        select: { id: true },
      });
      if (existingExercises.length !== exerciseIds.length) {
        const foundIds = existingExercises.map((ex) => ex.id);
        const notFoundIds = exerciseIds.filter((id) => !foundIds.includes(id));
        throw new NotFoundException(
          `Exercises not found with IDs: ${notFoundIds.join(', ')}`,
        );
      }
    }

    const createdWorkout = await this.prisma.workout.create({
      data: {
        ...workoutData,
        startDate: new Date(startDate), // Convert string date to Date object
        endDate: endDate ? new Date(endDate) : null,
        User: userId ? { connect: { id: userId } } : undefined,
        planExercises:
          planExercises && planExercises.length > 0
            ? {
                create: planExercises.map((pe) => ({
                  exercise: { connect: { id: pe.exerciseId } },
                  sets: pe.sets,
                  reps: pe.reps,
                  targetLoad: pe.targetLoad,
                  targetRestTime: pe.targetRestTime,
                  notes: pe.notes,
                  order: pe.order,
                })),
              }
            : undefined,
      },
      include: { planExercises: { include: { exercise: true } }, User: true },
    });
    return createdWorkout;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.WorkoutWhereUniqueInput;
    where?: Prisma.WorkoutWhereInput;
    orderBy?: Prisma.WorkoutOrderByWithRelationInput;
    userId?: string; // Optional filter by user ID
  }): Promise<Workout[]> {
    const { skip, take, cursor, where: baseWhere, orderBy, userId } = params;
    const where: Prisma.WorkoutWhereInput = { ...baseWhere };

    if (userId) {
      where.userId = userId;
    }

    return this.prisma.workout.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        planExercises: {
          orderBy: { order: 'asc' },
          include: { exercise: true },
        },
        User: true,
      },
    });
  }

  async findOne(id: string): Promise<Workout | null> {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
      include: {
        planExercises: {
          orderBy: { order: 'asc' },
          include: { exercise: true },
        },
        User: true,
      },
    });
    if (!workout) {
      throw new NotFoundException(`Workout with ID "${id}" not found`);
    }
    return workout;
  }

  async update(
    id: string,
    updateWorkoutDto: UpdateWorkoutDto,
  ): Promise<Workout> {
    const { userId, planExercises, startDate, endDate, ...workoutData } =
      updateWorkoutDto;

    const existingWorkout = await this.prisma.workout.findUnique({
      where: { id },
    });
    if (!existingWorkout) {
      throw new NotFoundException(`Workout with ID "${id}" not found.`);
    }

    if (userId !== undefined) {
      if (userId === null) {
        // Disconnect user logic if needed
      } else {
        const user: User | null = await this.prisma.user.findUnique({
          where: { id: userId },
        });
        if (!user) {
          throw new NotFoundException(`User with ID "${userId}" not found.`);
        }
      }
    }

    if (planExercises && planExercises.length > 0) {
      const exerciseIds = planExercises.map((pe) => pe.exerciseId);
      const existingExercises = await this.prisma.exercise.findMany({
        where: { id: { in: exerciseIds } },
        select: { id: true },
      });
      if (existingExercises.length !== exerciseIds.length) {
        const foundIds = existingExercises.map((ex) => ex.id);
        const notFoundIds = exerciseIds.filter((id) => !foundIds.includes(id));
        throw new NotFoundException(
          `Exercises not found with IDs for update: ${notFoundIds.join(', ')}`,
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedWorkoutData: Prisma.WorkoutUpdateInput = {
        ...workoutData,
      };
      if (startDate) updatedWorkoutData.startDate = new Date(startDate);
      if (endDate !== undefined)
        updatedWorkoutData.endDate = endDate ? new Date(endDate) : null;
      if (userId !== undefined) {
        updatedWorkoutData.User = userId
          ? { connect: { id: userId } }
          : { disconnect: true };
      }

      // The initial update of workout fields. The variable itself wasn't used further.
      await tx.workout.update({
        where: { id },
        data: updatedWorkoutData,
      });

      if (planExercises !== undefined) {
        await tx.workoutPlanExercise.deleteMany({ where: { workoutId: id } });
        if (planExercises.length > 0) {
          await tx.workoutPlanExercise.createMany({
            data: planExercises.map((pe) => ({
              workoutId: id,
              exerciseId: pe.exerciseId,
              sets: pe.sets,
              reps: pe.reps,
              targetLoad: pe.targetLoad,
              targetRestTime: pe.targetRestTime,
              notes: pe.notes,
              order: pe.order,
            })),
          });
        }
      }

      const resultWorkout = await tx.workout.findUnique({
        where: { id },
        include: {
          planExercises: {
            orderBy: { order: 'asc' },
            include: { exercise: true },
          },
          User: true,
        },
      });

      if (!resultWorkout) {
        // This should ideally not happen if the transaction is successful and ID is correct
        throw new NotFoundException(
          `Workout with ID "${id}" not found after update transaction.`,
        );
      }
      return resultWorkout;
    });
  }

  async remove(id: string): Promise<Workout> {
    // Prisma will cascade delete WorkoutPlanExercise entries due to onDelete: Cascade
    const workout = await this.prisma.workout.findUnique({ where: { id } });
    if (!workout) {
      throw new NotFoundException(`Workout with ID "${id}" not found`);
    }
    return this.prisma.workout.delete({ where: { id } });
  }
}
