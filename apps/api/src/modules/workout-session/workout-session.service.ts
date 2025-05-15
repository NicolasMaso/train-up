import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { CreateWorkoutSessionDto } from './dto/create-workout-session.dto';
import { UpdateWorkoutSessionDto } from './dto/update-workout-session.dto';
import { WorkoutSessionEntity } from './entities/workout-session.entity';
import { WorkoutSession, WorkoutSessionIntensity } from '@prisma/client'; // Adiciona a importação correta

@Injectable()
export class WorkoutSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createWorkoutSessionDto: CreateWorkoutSessionDto,
  ): Promise<WorkoutSessionEntity> {
    const { workoutId, date, duration, feedback, intensity } =
      createWorkoutSessionDto;

    // Check if workout exists
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
    });
    if (!workout) {
      throw new NotFoundException(`Workout with ID "${workoutId}" not found`);
    }

    const session = await this.prisma.workoutSession.create({
      data: {
        workoutId,
        date,
        duration,
        feedback,
        intensity,
      },
    });
    return this.mapToEntity(session);
  }

  async findAll(workoutId?: string): Promise<WorkoutSessionEntity[]> {
    const sessions = await this.prisma.workoutSession.findMany({
      where: {
        workoutId: workoutId || undefined,
      },
    });

    return sessions.map((session) => this.mapToEntity(session));
  }

  async findOne(id: string): Promise<WorkoutSessionEntity> {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id },
    });
    if (!session) {
      throw new NotFoundException(`Workout session with ID "${id}" not found`);
    }
    return this.mapToEntity(session);
  }

  async update(
    id: string,
    updateWorkoutSessionDto: UpdateWorkoutSessionDto,
  ): Promise<WorkoutSessionEntity> {
    const { date, duration, feedback, intensity } = updateWorkoutSessionDto;

    // Check if session exists
    const existingSession = await this.prisma.workoutSession.findUnique({
      where: { id },
    });
    if (!existingSession) {
      throw new NotFoundException(`Workout session with ID "${id}" not found`);
    }

    const updatedSession = await this.prisma.workoutSession.update({
      where: { id },
      data: {
        date,
        duration,
        feedback,
        intensity: intensity as WorkoutSessionIntensity,
      },
    });
    return this.mapToEntity(updatedSession);
  }

  async remove(id: string): Promise<WorkoutSessionEntity> {
    // Check if session exists before attempting to delete
    const session = await this.prisma.workoutSession.findUnique({
      where: { id },
    });
    if (!session) {
      throw new NotFoundException(`Workout session with ID "${id}" not found`);
    }
    // Prisma will cascade delete WorkoutSessionExercise due to schema relations
    const deletedSession = await this.prisma.workoutSession.delete({
      where: { id },
    });
    return this.mapToEntity(deletedSession);
  }

  private mapToEntity(
    session: WorkoutSession & {
      createdAt?: Date;
      updatedAt?: Date;
      userId?: string;
      startedAt?: Date | null;
      endedAt?: Date | null;
      notes?: string | null;
    },
  ): WorkoutSessionEntity {
    return {
      id: session.id,
      workoutId: session.workoutId,
      date: session.date,
      duration: session.duration,
      feedback: session.feedback,
      intensity: session.intensity,
      createdAt: session.createdAt || new Date(),
      updatedAt: session.updatedAt || new Date(),
      userId: session.userId || '',
      startedAt: session.startedAt || null,
      endedAt: session.endedAt || null,
      notes: session.notes || null,
    };
  }
}
