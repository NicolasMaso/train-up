import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise, Prisma } from '@prisma/client';

@Injectable()
export class ExerciseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const { exerciseGroupId, similarExerciseIds, ...exerciseData } =
      createExerciseDto;

    const data: Prisma.ExerciseCreateInput = {
      ...exerciseData,
    };

    if (exerciseGroupId) {
      const group = await this.prisma.exerciseGroup.findUnique({
        where: { id: exerciseGroupId },
      });
      if (!group) {
        throw new NotFoundException(
          `ExerciseGroup with ID "${exerciseGroupId}" not found`,
        );
      }
      data.ExerciseGroup = {
        connect: { id: exerciseGroupId },
      };
    }

    if (similarExerciseIds && similarExerciseIds.length > 0) {
      // Validate all similar exercises exist
      const existingSimilarExercises = await this.prisma.exercise.findMany({
        where: { id: { in: similarExerciseIds } },
        select: { id: true },
      });
      if (existingSimilarExercises.length !== similarExerciseIds.length) {
        const foundIds = existingSimilarExercises.map((ex) => ex.id);
        const notFoundIds = similarExerciseIds.filter(
          (id) => !foundIds.includes(id),
        );
        throw new NotFoundException(
          `Similar exercises not found with IDs: ${notFoundIds.join(', ')}`,
        );
      }
      data.similarExercises = {
        connect: similarExerciseIds.map((id) => ({ id })),
      };
    }

    return this.prisma.exercise.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ExerciseWhereUniqueInput;
    where?: Prisma.ExerciseWhereInput;
    orderBy?: Prisma.ExerciseOrderByWithRelationInput;
  }): Promise<Exercise[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.exercise.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        similarExercises: true,
        referencedByExercises: true,
        ExerciseGroup: true,
      }, // Include related data
    });
  }

  async findOne(id: string): Promise<Exercise | null> {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: {
        similarExercises: true,
        referencedByExercises: true,
        ExerciseGroup: true,
      }, // Include related data
    });
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID "${id}" not found`);
    }
    return exercise;
  }

  async update(
    id: string,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    const existingExercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: { similarExercises: true }, // For managing disconnections
    });

    if (!existingExercise) {
      throw new NotFoundException(`Exercise with ID "${id}" not found`);
    }

    const { exerciseGroupId, similarExerciseIds, ...exerciseData } =
      updateExerciseDto;

    const data: Prisma.ExerciseUpdateInput = {
      ...exerciseData,
    };

    if (exerciseGroupId !== undefined) {
      // Check for undefined to allow explicit null/disconnect
      if (exerciseGroupId === null) {
        // Disconnect from group
        data.ExerciseGroup = {
          disconnect: true,
        };
      } else {
        const group = await this.prisma.exerciseGroup.findUnique({
          where: { id: exerciseGroupId },
        });
        if (!group) {
          throw new NotFoundException(
            `ExerciseGroup with ID "${exerciseGroupId}" not found`,
          );
        }
        data.ExerciseGroup = {
          connect: { id: exerciseGroupId },
        };
      }
    }

    if (similarExerciseIds !== undefined) {
      const currentSimilarIds = existingExercise.similarExercises.map(
        (ex) => ex.id,
      );
      const idsToConnect = similarExerciseIds.filter(
        (sid) => !currentSimilarIds.includes(sid),
      );
      const idsToDisconnect = currentSimilarIds.filter(
        (sid) => !similarExerciseIds.includes(sid),
      );

      if (idsToConnect.length > 0) {
        const existingConnectExercises = await this.prisma.exercise.findMany({
          where: { id: { in: idsToConnect } },
          select: { id: true },
        });
        if (existingConnectExercises.length !== idsToConnect.length) {
          const foundIds = existingConnectExercises.map((ex) => ex.id);
          const notFoundIds = idsToConnect.filter(
            (id) => !foundIds.includes(id),
          );
          throw new NotFoundException(
            `Similar exercises to connect not found with IDs: ${notFoundIds.join(', ')}`,
          );
        }
      }

      data.similarExercises = {
        connect: idsToConnect.map((sid) => ({ id: sid })),
        disconnect: idsToDisconnect.map((sid) => ({ id: sid })),
      };
    }

    return this.prisma.exercise.update({
      where: { id },
      data,
      include: {
        similarExercises: true,
        referencedByExercises: true,
        ExerciseGroup: true,
      },
    });
  }

  async remove(id: string): Promise<Exercise> {
    const exercise = await this.prisma.exercise.findUnique({ where: { id } });
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID "${id}" not found`);
    }
    // Prisma automatically handles cleaning up relations for many-to-many based on the schema
    return this.prisma.exercise.delete({ where: { id } });
  }
}
