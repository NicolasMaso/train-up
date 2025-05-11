import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma/prisma.service'; // Adjust path if needed
import { CreatePhysicalAssessmentDto } from './dto/create-physical-assessment.dto';
import { UpdatePhysicalAssessmentDto } from './dto/update-physical-assessment.dto';
import { PhysicalAssessment } from '@prisma/client';

@Injectable()
export class PhysicalAssessmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createPhysicalAssessmentDto: CreatePhysicalAssessmentDto,
  ): Promise<PhysicalAssessment> {
    const { userId, ...assessmentData } = createPhysicalAssessmentDto;
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    return this.prisma.physicalAssessment.create({
      data: {
        ...assessmentData,
        userId,
      },
    });
  }

  async findAllByUser(userId: string): Promise<PhysicalAssessment[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    return this.prisma.physicalAssessment.findMany({
      where: { userId },
      orderBy: { date: 'desc' }, // Optional: order by date
    });
  }

  async findOne(id: string): Promise<PhysicalAssessment | null> {
    const assessment = await this.prisma.physicalAssessment.findUnique({
      where: { id },
    });
    if (!assessment) {
      throw new NotFoundException(
        `PhysicalAssessment with ID "${id}" not found`,
      );
    }
    return assessment;
  }

  async update(
    id: string,
    updatePhysicalAssessmentDto: UpdatePhysicalAssessmentDto,
  ): Promise<PhysicalAssessment> {
    // Check if assessment exists
    const existingAssessment = await this.prisma.physicalAssessment.findUnique({
      where: { id },
    });
    if (!existingAssessment) {
      throw new NotFoundException(
        `PhysicalAssessment with ID "${id}" not found`,
      );
    }

    // userId is not typically updated this way. If it needs to be, ensure checks for the new user's existence.
    const { userId, ...assessmentData } = updatePhysicalAssessmentDto;
    if (userId && userId !== existingAssessment.userId) {
      // Potentially re-assigning to a new user, ensure new user exists
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(
          `User with ID "${userId}" not found for re-assignment.`,
        );
      }
    }

    return this.prisma.physicalAssessment.update({
      where: { id },
      data: assessmentData, // Prisma automatically handles partial updates for defined fields
    });
  }

  async remove(id: string): Promise<PhysicalAssessment> {
    // Check if assessment exists
    const existingAssessment = await this.prisma.physicalAssessment.findUnique({
      where: { id },
    });
    if (!existingAssessment) {
      throw new NotFoundException(
        `PhysicalAssessment with ID "${id}" not found`,
      );
    }
    return this.prisma.physicalAssessment.delete({
      where: { id },
    });
  }
}
