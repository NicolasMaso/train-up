import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
  IsArray,
  IsUrl,
} from 'class-validator';
import { ExerciseType, MuscleGroup } from '@prisma/client'; // Assuming these enums are available

export class CreateExerciseDto {
  @ApiProperty({ description: 'Title of the exercise', example: 'Bench Press' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Detailed description of the exercise' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'URL of an image for the exercise' })
  @IsOptional()
  @IsUrl()
  image?: string; // Alinha com o Prisma

  @ApiPropertyOptional({ description: 'URL of a video for the exercise' })
  @IsOptional()
  @IsUrl()
  video?: string; // Alinha com o Prisma

  @ApiProperty({ enum: ExerciseType, description: 'Type of exercise' })
  @IsEnum(ExerciseType)
  @IsNotEmpty()
  type: ExerciseType;

  @ApiPropertyOptional({
    description: 'Main muscle group targeted',
    enum: MuscleGroup,
  })
  @IsOptional()
  @IsEnum(MuscleGroup)
  muscleGroup?: MuscleGroup; // Alinha com o Prisma

  @ApiPropertyOptional({
    description: 'ID of the exercise group this exercise belongs to',
  })
  @IsOptional()
  @IsUUID()
  exerciseGroupId?: string;

  @ApiPropertyOptional({
    description: 'Array of IDs of similar exercises',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true }) // Validates each element in the array is a UUID
  similarExerciseIds?: string[];
}
