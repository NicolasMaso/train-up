import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { CreateExerciseGroupDto } from './dto/create-exercise-group.dto';
import { UpdateExerciseGroupDto } from './dto/update-exercise-group.dto';
import { ExerciseGroup, Prisma } from '@prisma/client';

@Injectable()
export class ExerciseGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateExerciseGroupDto): Promise<ExerciseGroup> {
    const { exerciseIds, ...groupData } = createDto;

    const data: Prisma.ExerciseGroupCreateInput = {
      ...groupData,
      exercises: exerciseIds
        ? {
            connect: exerciseIds.map((id) => ({ id })),
          }
        : undefined,
    };

    return this.prisma.exerciseGroup.create({
      data,
      include: { exercises: true },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ExerciseGroupWhereUniqueInput;
    where?: Prisma.ExerciseGroupWhereInput;
    orderBy?: Prisma.ExerciseGroupOrderByWithRelationInput;
  }): Promise<ExerciseGroup[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.exerciseGroup.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { exercises: true }, // Include exercises linked to this group
    });
  }

  async findOne(id: string): Promise<ExerciseGroup | null> {
    const group = await this.prisma.exerciseGroup.findUnique({
      where: { id },
      include: { exercises: true }, // Include exercises linked to this group
    });
    if (!group) {
      throw new NotFoundException(`ExerciseGroup with ID "${id}" not found`);
    }
    return group;
  }

  async update(
    id: string,
    updateDto: UpdateExerciseGroupDto,
  ): Promise<ExerciseGroup> {
    const { exerciseIds, ...groupData } = updateDto;

    const data: Prisma.ExerciseGroupUpdateInput = {
      ...groupData,
      exercises: exerciseIds
        ? {
            set: exerciseIds.map((id) => ({ id })),
          }
        : undefined,
    };

    return this.prisma.exerciseGroup.update({
      where: { id },
      data,
      include: { exercises: true },
    });
  }

  async remove(id: string): Promise<ExerciseGroup> {
    await this.findOne(id); // Ensure group exists
    // Note: Deleting an ExerciseGroup might require handling of exercises linked to it,
    // depending on schema (e.g., set exercises' groupId to null or cascade delete).
    // Prisma's default behavior depends on the relation definition (onDelete).
    // For now, we assume exercises will be disassociated or handled as per schema defaults.
    return this.prisma.exerciseGroup.delete({
      where: { id },
    });
  }
}
