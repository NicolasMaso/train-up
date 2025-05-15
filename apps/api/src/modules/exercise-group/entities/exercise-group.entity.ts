import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExerciseEntity } from '../../exercise/entities/exercise.entity';

export class ExerciseGroupEntity {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000000' })
  id: string;

  @ApiProperty({ example: 'Upper Body Strength' })
  name: string;

  @ApiProperty({
    example: 'A group of exercises focused on upper body strength.',
  })
  description: string;

  @ApiProperty({
    type: () => [ExerciseEntity],
    description: 'List of exercises associated with this group',
  })
  exercises?: ExerciseEntity[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
