import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserLifestyleSurveyEntity } from '../../../database/entities/user-lifestyle-survey.entity'

@Injectable()
export class UserLifestyleSurveyCrudService {
  constructor(
    @InjectRepository(UserLifestyleSurveyEntity)
    protected userLifestyleSurveyRepository: Repository<UserLifestyleSurveyEntity>,
  ) {}

  async getUserLifestyleSurveyByUserId(id: string): Promise<UserLifestyleSurveyEntity> {
    return this.userLifestyleSurveyRepository.findOne({ where: { userId: id } })
  }

  async upsertUserLifestyleSurveyByUserId(
    id: string,
    params: Partial<UserLifestyleSurveyEntity>,
  ): Promise<UserLifestyleSurveyEntity> {
    const journey = await this.userLifestyleSurveyRepository.findOne({ where: { userId: id } })

    if (journey) {
      await this.userLifestyleSurveyRepository.update(journey.id, params)

      return this.userLifestyleSurveyRepository.findOne({ where: { userId: id } })
    }

    return this.userLifestyleSurveyRepository.save({ userId: id, ...params })
  }

  async updateUserLifestyleSurveyById(id: string, params: Partial<UserLifestyleSurveyEntity>) {
    return this.userLifestyleSurveyRepository.update(id, params)
  }
}
