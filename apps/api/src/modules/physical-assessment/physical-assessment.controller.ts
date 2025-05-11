import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PhysicalAssessmentService } from './physical-assessment.service';
import { CreatePhysicalAssessmentDto } from './dto/create-physical-assessment.dto';
import { UpdatePhysicalAssessmentDto } from './dto/update-physical-assessment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PhysicalAssessment } from '@prisma/client';

@ApiTags('Physical Assessments')
@Controller('physical-assessments')
export class PhysicalAssessmentController {
  constructor(
    private readonly physicalAssessmentService: PhysicalAssessmentService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new physical assessment' })
  @ApiResponse({
    status: 201,
    description: 'The physical assessment has been successfully created.',
    type: Object, // Ideally, replace with a PhysicalAssessmentResponseDto if you have one
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  create(
    @Body() createPhysicalAssessmentDto: CreatePhysicalAssessmentDto,
  ): Promise<PhysicalAssessment> {
    return this.physicalAssessmentService.create(createPhysicalAssessmentDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all physical assessments for a user' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: String })
  @ApiResponse({
    status: 200,
    description: 'List of physical assessments for the user.',
    type: [Object], // Ideally, replace with [PhysicalAssessmentResponseDto]
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findAllByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<PhysicalAssessment[]> {
    return this.physicalAssessmentService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a physical assessment by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the physical assessment',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The physical assessment.',
    type: Object, // Ideally, replace with PhysicalAssessmentResponseDto
  })
  @ApiResponse({ status: 404, description: 'Physical assessment not found.' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PhysicalAssessment | null> {
    return this.physicalAssessmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a physical assessment' })
  @ApiParam({
    name: 'id',
    description: 'ID of the physical assessment to update',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The physical assessment has been successfully updated.',
    type: Object, // Ideally, replace with PhysicalAssessmentResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Physical assessment not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePhysicalAssessmentDto: UpdatePhysicalAssessmentDto,
  ): Promise<PhysicalAssessment> {
    return this.physicalAssessmentService.update(
      id,
      updatePhysicalAssessmentDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a physical assessment' })
  @ApiParam({
    name: 'id',
    description: 'ID of the physical assessment to delete',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'The physical assessment has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Physical assessment not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.physicalAssessmentService.remove(id);
  }
}
