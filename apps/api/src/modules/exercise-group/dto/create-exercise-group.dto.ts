import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateExerciseGroupDto {
  @ApiProperty({
    description: 'Title of the exercise group',
    example: 'Chest Workouts',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100) // Example max length
  title: string;

  @ApiPropertyOptional({
    description: 'Optional description for the exercise group',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500) // Example max length
  description?: string;
}
