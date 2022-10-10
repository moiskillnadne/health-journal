import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserLifestyleSurveyEntity } from '../../../database/entities/user-lifestyle-survey.entity'
import { UserLifestyleSurveyCrudService } from './user-lifestyle-survey.crud'

@Module({
  imports: [TypeOrmModule.forFeature([UserLifestyleSurveyEntity])],
  providers: [UserLifestyleSurveyCrudService],
  exports: [UserLifestyleSurveyCrudService],
})
export class UserLifestyleSurveyModule {}
