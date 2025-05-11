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
import { ExerciseGroupService } from './exercise-group.service';
import { CreateExerciseGroupDto } from './dto/create-exercise-group.dto';
import { UpdateExerciseGroupDto } from './dto/update-exercise-group.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ExerciseGroup, Prisma } from '@prisma/client';

@ApiTags('Exercise Groups')
@Controller('exercise-groups')
export class ExerciseGroupController {
  constructor(private readonly exerciseGroupService: ExerciseGroupService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exercise group' })
  @ApiResponse({
    status: 201,
    description: 'The exercise group has been successfully created.',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createDto: CreateExerciseGroupDto): Promise<ExerciseGroup> {
    return this.exerciseGroupService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exercise groups' })
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
    description: 'Filter by title (case-insensitive, contains)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of exercise groups.',
    type: [Object],
  })
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('title') title?: string,
  ) {
    const where: Prisma.ExerciseGroupWhereInput = {};
    if (title) where.title = { contains: title, mode: 'insensitive' };

    return this.exerciseGroupService.findAll({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      where,
      orderBy: { title: 'asc' }, // Example ordering
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an exercise group by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the exercise group',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The exercise group.',
    type: Object,
  })
  @ApiResponse({ status: 404, description: 'Exercise group not found.' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ExerciseGroup | null> {
    return this.exerciseGroupService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an exercise group' })
  @ApiParam({
    name: 'id',
    description: 'ID of the exercise group to update',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The exercise group has been successfully updated.',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Exercise group not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateExerciseGroupDto,
  ): Promise<ExerciseGroup> {
    return this.exerciseGroupService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an exercise group' })
  @ApiParam({
    name: 'id',
    description: 'ID of the exercise group to delete',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'The exercise group has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Exercise group not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.exerciseGroupService.remove(id);
  }
}
