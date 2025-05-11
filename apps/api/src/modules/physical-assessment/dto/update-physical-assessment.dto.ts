import { PartialType } from '@nestjs/swagger'; // Or @nestjs/mapped-types if swagger is not used for this
import { CreatePhysicalAssessmentDto } from './create-physical-assessment.dto';

export class UpdatePhysicalAssessmentDto extends PartialType(
  CreatePhysicalAssessmentDto,
) {
  // userId is typically not updatable or handled via route parameter, so it's omitted here.
  // If it needs to be updatable via body, it can be added back.
}
