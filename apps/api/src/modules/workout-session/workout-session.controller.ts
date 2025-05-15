import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WorkoutSessionService } from './workout-session.service';
import { CreateWorkoutSessionDto } from './dto/create-workout-session.dto';
import { UpdateWorkoutSessionDto } from './dto/update-workout-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { WorkoutSessionEntity } from './entities/workout-session.entity';

@ApiTags('Workout Sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workout-sessions')
export class WorkoutSessionController {
  constructor(private readonly service: WorkoutSessionService) {}

  @Post()
  @ApiOperation({ summary: 'Start a new workout session' })
  @ApiResponse({
    status: 201,
    description: 'The workout session has been successfully started.',
    type: WorkoutSessionEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User or Workout not found.' })
  create(@Body() createDto: CreateWorkoutSessionDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all workout sessions, optionally filtered by workout',
  })
  @ApiQuery({
    name: 'workoutId',
    required: false,
    description: 'ID of the workout plan to filter sessions by',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of workout sessions.',
    type: [WorkoutSessionEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(
    @Query('workoutId', new ParseUUIDPipe({ optional: true }))
    workoutId?: string,
  ) {
    return this.service.findAll(workoutId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific workout session by its ID' })
  @ApiParam({ name: 'id', description: 'ID of the workout session' })
  @ApiResponse({
    status: 200,
    description: 'Details of the workout session.',
    type: WorkoutSessionEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Workout session not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a workout session' })
  @ApiParam({ name: 'id', description: 'ID of the workout session to update' })
  @ApiResponse({
    status: 200,
    description: 'The workout session has been successfully updated.',
    type: WorkoutSessionEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 404,
    description: 'Workout session, User or Workout not found.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateWorkoutSessionDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a workout session' })
  @ApiParam({ name: 'id', description: 'ID of the workout session to delete' })
  @ApiResponse({
    status: 200,
    description: 'The workout session has been successfully deleted.',
    type: WorkoutSessionEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Workout session not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
