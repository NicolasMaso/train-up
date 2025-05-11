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
import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Workout, Prisma } from '@prisma/client'; // Prisma for WhereInput types if needed

@ApiTags('Workouts')
@Controller('workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workout plan' })
  @ApiResponse({
    status: 201,
    description: 'The workout plan has been successfully created.',
    type: Object,
  }) // Consider creating a WorkoutResponseDto
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., validation error, missing exercise ID).',
  })
  @ApiResponse({
    status: 404,
    description: 'User or specified Exercise ID not found.',
  })
  create(@Body() createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    return this.workoutService.create(createWorkoutDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workout plans with optional filtering' })
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
    name: 'userId',
    required: false,
    type: String,
    description: 'Filter by User ID (student ID)',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Filter by workout title (case-insensitive, contains)',
  })
  // Add more ApiQuery for level, etc. if needed
  @ApiResponse({
    status: 200,
    description: 'List of workout plans.',
    type: [Object],
  }) // Consider WorkoutResponseDto[]
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('userId') userId?: string,
    @Query('title') title?: string,
  ) {
    const where: Prisma.WorkoutWhereInput = {};
    if (title) where.title = { contains: title, mode: 'insensitive' };
    // userId filter is handled directly in service for this example, but could also be part of 'where' here

    return this.workoutService.findAll({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      where,
      userId, // Pass userId to service for dedicated filtering
      orderBy: { startDate: 'desc' }, // Example ordering
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a workout plan by ID' })
  @ApiParam({ name: 'id', description: 'ID of the workout plan', type: String })
  @ApiResponse({ status: 200, description: 'The workout plan.', type: Object }) // Consider WorkoutResponseDto
  @ApiResponse({ status: 404, description: 'Workout plan not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Workout | null> {
    return this.workoutService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a workout plan' })
  @ApiParam({
    name: 'id',
    description: 'ID of the workout plan to update',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The workout plan has been successfully updated.',
    type: Object,
  }) // Consider WorkoutResponseDto
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 404,
    description: 'Workout plan, User, or Exercise ID not found.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
  ): Promise<Workout> {
    return this.workoutService.update(id, updateWorkoutDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a workout plan' })
  @ApiParam({
    name: 'id',
    description: 'ID of the workout plan to delete',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'The workout plan has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Workout plan not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.workoutService.remove(id);
  }
}
