import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { User, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateUserDto): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createDto.password, 10);

    // Explicitly construct the data object matching UserCreateInput fields
    const dataForCreate: Prisma.UserCreateInput = {
      email: createDto.email,
      password: hashedPassword,
      role: createDto.role || Role.STUDENT,
    };

    if (createDto.name !== undefined) {
      dataForCreate.name = createDto.name;
    }
    // Add other optional fields from CreateUserDto similarly if they exist
    // if (createDto.age !== undefined) dataForCreate.age = createDto.age;
    // if (createDto.weight !== undefined) dataForCreate.weight = createDto.weight;
    // if (createDto.height !== undefined) dataForCreate.height = createDto.height;
    // if (createDto.avatar !== undefined) dataForCreate.avatar = createDto.avatar;

    return this.prisma.user.create({
      data: dataForCreate,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      // Optionally throw NotFoundException or let the caller handle null
      // For auth purposes, often null is preferred to avoid leaking info
    }
    return user;
  }

  // Basic findAll - extend with pagination/filtering as needed
  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      select: {
        // Explicitly select fields to omit password
        id: true,
        email: true,
        name: true,
        age: true,
        weight: true,
        height: true,
        goals: true, // Be mindful of data size if goals/workouts are large
        workouts: true,
        avatar: true,
        role: true,
        PhysicalAssessment: true,
        Subscription: true,
        // DO NOT INCLUDE PASSWORD
      },
    });
  }

  // Basic update - extend as needed
  async update(
    id: string,
    data: Partial<CreateUserDto>,
  ): Promise<Omit<User, 'password'> | null> {
    const userToUpdate = await this.findById(id);
    if (!userToUpdate) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        // Omit password from return
        id: true,
        email: true,
        name: true,
        age: true,
        weight: true,
        height: true,
        goals: true,
        workouts: true,
        avatar: true,
        role: true,
        PhysicalAssessment: true,
        Subscription: true,
      },
    });
    return updatedUser;
  }

  // Basic delete
  async remove(id: string): Promise<Omit<User, 'password'> | null> {
    const userToDelete = await this.findById(id);
    if (!userToDelete) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    // Consider what happens to related entities (Goals, Workouts, etc.)
    // Prisma schema onDelete settings will determine this.
    const deletedUser = await this.prisma.user.delete({
      where: { id },
      select: {
        // Omit password from return
        id: true,
        email: true,
        name: true,
        age: true,
        weight: true,
        height: true,
        goals: true,
        workouts: true,
        avatar: true,
        role: true,
        PhysicalAssessment: true,
        Subscription: true,
      },
    });
    return deletedUser;
  }
}
