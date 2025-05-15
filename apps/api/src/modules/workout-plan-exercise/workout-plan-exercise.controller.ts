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
import { WorkoutPlanExerciseService } from './workout-plan-exercise.service';
import { CreateWorkoutPlanExerciseDto } from './dto/create-workout-plan-exercise.dto';
import { UpdateWorkoutPlanExerciseDto } from './dto/update-workout-plan-exercise.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { WorkoutPlanExerciseEntity } from './entities/workout-plan-exercise.entity';

@ApiTags('Workout Plan Exercises')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workout-plan-exercises')
export class WorkoutPlanExerciseController {
  constructor(private readonly service: WorkoutPlanExerciseService) {}

  @Post()
  @ApiOperation({ summary: 'Add an exercise to a workout plan' })
  @ApiResponse({
    status: 201,
    description: 'The exercise has been successfully added to the plan.',
    type: WorkoutPlanExerciseEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Workout or Exercise not found.' })
  create(@Body() createDto: CreateWorkoutPlanExerciseDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exercises for a specific workout plan' })
  @ApiQuery({
    name: 'workoutId',
    required: true,
    description: 'ID of the workout plan',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of planned exercises for the workout.',
    type: [WorkoutPlanExerciseEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Workout not found.' })
  findAllByWorkoutId(@Query('workoutId', ParseUUIDPipe) workoutId: string) {
    return this.service.findAllByWorkoutId(workoutId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific planned exercise by its ID' })
  @ApiParam({ name: 'id', description: 'ID of the planned exercise' })
  @ApiResponse({
    status: 200,
    description: 'Details of the planned exercise.',
    type: WorkoutPlanExerciseEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Planned exercise not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a planned exercise' })
  @ApiParam({ name: 'id', description: 'ID of the planned exercise to update' })
  @ApiResponse({
    status: 200,
    description: 'The planned exercise has been successfully updated.',
    type: WorkoutPlanExerciseEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 404,
    description: 'Planned exercise, Workout or Exercise not found.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateWorkoutPlanExerciseDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove an exercise from a workout plan' })
  @ApiParam({ name: 'id', description: 'ID of the planned exercise to delete' })
  @ApiResponse({
    status: 200,
    description: 'The planned exercise has been successfully removed.',
    type: WorkoutPlanExerciseEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Planned exercise not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }

  @Delete('workout/:workoutId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove all exercises from a specific workout plan',
  })
  @ApiParam({
    name: 'workoutId',
    description: 'ID of the workout plan to clear',
  })
  @ApiResponse({
    status: 200,
    description: 'All exercises have been successfully removed from the plan.',
    schema: { type: 'object', properties: { count: { type: 'number' } } },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Workout not found.' })
  removeAllByWorkoutId(@Param('workoutId', ParseUUIDPipe) workoutId: string) {
    return this.service.removeAllByWorkoutId(workoutId);
  }
}
