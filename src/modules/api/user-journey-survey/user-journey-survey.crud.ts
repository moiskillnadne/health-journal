import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserJourneySurveyEntity } from '../../../database/entities/user-journey-survey.entity'

@Injectable()
export class UserJourneySurveyCrudService {
  constructor(
    @InjectRepository(UserJourneySurveyEntity)
    protected userJourneySurveyRepository: Repository<UserJourneySurveyEntity>,
  ) {}

  async getUserJourneySurveyByUserId(id: string): Promise<UserJourneySurveyEntity> {
    return this.userJourneySurveyRepository.findOne({ where: { userId: id } })
  }

  async upsertUserJourneySurveyByUserId(
    id: string,
    params: Partial<UserJourneySurveyEntity>,
  ): Promise<UserJourneySurveyEntity> {
    const journey = await this.userJourneySurveyRepository.findOne({ where: { userId: id } })

    if (journey) {
      await this.userJourneySurveyRepository.update(journey.id, params)

      return this.userJourneySurveyRepository.findOne({ where: { userId: id } })
    }

    return this.userJourneySurveyRepository.save({ userId: id, ...params })
  }

  async updateUserJourneySurveyById(id: string, params: Partial<UserJourneySurveyEntity>) {
    return this.userJourneySurveyRepository.update(id, params)
  }
}
