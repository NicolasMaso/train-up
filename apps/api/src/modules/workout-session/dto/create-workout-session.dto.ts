import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { WorkoutSessionIntensity } from '@prisma/client'; // Importa o tipo correto

export class CreateWorkoutSessionDto {
  @ApiProperty({
    description: 'ID of the user performing the session',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'ID of the workout plan being executed',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsNotEmpty()
  @IsUUID()
  workoutId: string;

  @ApiProperty({
    description: 'Date and time when the session started',
    example: '2024-07-21T10:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startedAt: Date;

  @ApiProperty({
    description: 'Date and time when the session ended',
    example: '2024-07-21T11:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endedAt?: Date;

  @ApiProperty({
    description: 'General notes about the workout session',
    example: 'Felt strong today, increased weight on bench press.',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Date of the workout session',
    example: '2025-05-14T10:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Duration of the workout session in minutes',
    example: 60,
  })
  @IsNotEmpty()
  @IsInt()
  duration: number;

  @ApiProperty({
    description: 'Feedback about the workout session',
    example: 'Felt great!',
    required: false,
  })
  @IsOptional()
  @IsString()
  feedback?: string;

  @ApiProperty({
    description: 'Intensity level of the workout session',
    example: 'HIGH',
  })
  @IsNotEmpty()
  intensity: WorkoutSessionIntensity; // Ajusta o tipo para ser compatível com o Prisma
}
