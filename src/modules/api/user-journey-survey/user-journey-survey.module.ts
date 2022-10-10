import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserJourneySurveyEntity } from '../../../database/entities/user-journey-survey.entity'
import { UserJourneySurveyCrudService } from './user-journey-survey.crud'

@Module({
  imports: [TypeOrmModule.forFeature([UserJourneySurveyEntity])],
  providers: [UserJourneySurveyCrudService],
  exports: [UserJourneySurveyCrudService],
})
export class UserJourneySurveyModule {}
