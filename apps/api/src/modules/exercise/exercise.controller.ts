import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Exercise, Prisma, ExerciseType, MuscleGroup } from '@prisma/client';

@ApiTags('Exercises')
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exercise' })
  @ApiResponse({
    status: 201,
    description: 'The exercise has been successfully created.',
    type: Object,
  }) // Replace Object with actual response DTO if defined
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 404,
    description:
      'Related entity (e.g., ExerciseGroup or SimilarExercise) not found.',
  })
  create(@Body() createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    return this.exerciseService.create(createExerciseDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all exercises with optional filtering and pagination',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of records to skip',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of records to take',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Filter by exercise title (case-insensitive, contains)',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ExerciseType,
    description: 'Filter by exercise type',
  })
  @ApiQuery({
    name: 'muscleGroup',
    required: false,
    enum: MuscleGroup,
    description: 'Filter by muscle group',
  })
  @ApiQuery({
    name: 'exerciseGroupId',
    required: false,
    type: String,
    description: 'Filter by exercise group ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of exercises.',
    type: [Object],
  }) // Replace [Object] with actual response DTO if defined
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('title') title?: string,
    @Query('type') type?: ExerciseType,
    @Query('muscleGroup') muscleGroup?: MuscleGroup,
    @Query('exerciseGroupId') exerciseGroupId?: string,
  ) {
    const where: Prisma.ExerciseWhereInput = {};
    if (title) where.title = { contains: title, mode: 'insensitive' };
    if (type && Object.values(ExerciseType).includes(type)) {
      where.type = type;
    } else if (type) {
      console.warn(`Invalid ExerciseType provided: ${type}`);
    }

    if (muscleGroup && Object.values(MuscleGroup).includes(muscleGroup)) {
      where.muscleGroup = muscleGroup;
    } else if (muscleGroup) {
      console.warn(`Invalid MuscleGroup provided: ${muscleGroup}`);
    }

    if (exerciseGroupId) where.exerciseGroupId = exerciseGroupId;

    return this.exerciseService.findAll({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      where,
      // orderBy: { title: 'asc' } // Example ordering
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an exercise by ID' })
  @ApiParam({ name: 'id', description: 'ID of the exercise', type: String })
  @ApiResponse({ status: 200, description: 'The exercise.', type: Object }) // Replace Object with actual response DTO if defined
  @ApiResponse({ status: 404, description: 'Exercise not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Exercise | null> {
    return this.exerciseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an exercise' })
  @ApiParam({
    name: 'id',
    description: 'ID of the exercise to update',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The exercise has been successfully updated.',
    type: Object,
  }) // Replace Object with actual response DTO if defined
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 404,
    description: 'Exercise or related entity not found.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    return this.exerciseService.update(id, updateExerciseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an exercise' })
  @ApiParam({
    name: 'id',
    description: 'ID of the exercise to delete',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'The exercise has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Exercise not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.exerciseService.remove(id);
  }
}
