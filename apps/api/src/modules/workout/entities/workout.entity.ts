import { ApiProperty } from '@nestjs/swagger';

export class WorkoutEntity {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000000' })
  id: string;

  @ApiProperty({ example: 'Full Body Workout' })
  name: string;

  @ApiProperty({ example: 'A complete workout for all muscle groups.' })
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
