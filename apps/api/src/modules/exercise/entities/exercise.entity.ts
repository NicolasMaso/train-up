import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExerciseEntity {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000000' })
  id: string;

  @ApiProperty({ example: 'Push-up' })
  name: string;

  @ApiProperty({
    example:
      'An upper body exercise that targets the chest, shoulders, and triceps.',
  })
  description: string;

  @ApiProperty({ example: 'Bodyweight' })
  category: string;

  @ApiPropertyOptional({ example: 'https://example.com/video.mp4' })
  videoUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  imageUrl?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['00000000-0000-0000-0000-000000000001'],
  })
  similarExerciseIds?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['Chest', 'Triceps'],
  })
  muscleGroups?: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
