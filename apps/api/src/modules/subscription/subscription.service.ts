import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
    userId: string,
  ): Promise<Subscription> {
    return this.prisma.subscription.create({
      data: {
        ...createSubscriptionDto,
        userId: userId,
      },
    });
  }

  async findAll(): Promise<Subscription[]> {
    return this.prisma.subscription.findMany();
  }

  async findAllByUserId(userId: string): Promise<Subscription[]> {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    return this.prisma.subscription.findMany({ where: { userId } });
  }

  async findOne(id: string): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID "${id}" not found`);
    }
    return subscription;
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    const existingSubscription = await this.prisma.subscription.findUnique({
      where: { id },
    });
    if (!existingSubscription) {
      throw new NotFoundException(`Subscription with ID "${id}" not found`);
    }

    if (updateSubscriptionDto.userId) {
      const userToTransfer = await this.prisma.user.findUnique({
        where: { id: updateSubscriptionDto.userId },
      });
      if (!userToTransfer) {
        throw new NotFoundException(
          `User with ID "${updateSubscriptionDto.userId}" not found for transfer`,
        );
      }
    }

    return this.prisma.subscription.update({
      where: { id },
      data: updateSubscriptionDto,
    });
  }

  async remove(id: string): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID "${id}" not found`);
    }
    return this.prisma.subscription.delete({
      where: { id },
    });
  }
}
