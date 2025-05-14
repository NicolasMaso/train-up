import { Module } from '@nestjs/common';
import { PhysicalAssessmentService } from './physical-assessment.service';
import { PhysicalAssessmentController } from './physical-assessment.controller';
import { PrismaModule } from '../../infra/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PhysicalAssessmentController],
  providers: [PhysicalAssessmentService],
})
export class PhysicalAssessmentModule {}
