import { Module } from '@nestjs/common';
import { PhysicalAssessmentService } from './physical-assessment.service';
import { PhysicalAssessmentController } from './physical-assessment.controller';
import { PrismaModule } from '../../infra/database/prisma/prisma.module';
// Assuming you have a PrismaModule that provides PrismaService

@Module({
  imports: [PrismaModule], // Import PrismaModule to make PrismaService available
  controllers: [PhysicalAssessmentController],
  providers: [PhysicalAssessmentService],
})
export class PhysicalAssessmentModule {}
