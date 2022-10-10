import { Injectable } from '@nestjs/common'

import { UserCardProfileCrudService } from '../../../user-card-profile/user-card-profile.crud'
import { UserJourneySurveyCrudService } from '../../../user-journey-survey/user-journey-survey.crud'
import { UserLifestyleSurveyCrudService } from '../../../user-lifestyle-survey/user-lifestyle-survey.crud'

import { AssessmentLifestyleParamsDto } from './dto/assessment-lifestyle.dto'

@Injectable()
export class AssessmentLifeStyleService {
  constructor(
    private userCardProfileCrudService: UserCardProfileCrudService,
    private userJourneySurveyCrudService: UserJourneySurveyCrudService,
    private userLifestyleSurveyCrudService: UserLifestyleSurveyCrudService,
  ) {}

  async addLifestyleInfoByParams(userId: string, cardId: string, params: AssessmentLifestyleParamsDto): Promise<void> {
    await this.userCardProfileCrudService.upsertUserProfileDataByCardId(cardId, {
      averageDailyWaterIntake: params.averageDailyWaterIntake || null,
      averageDailySleepHours: params.averageDailySleepHours || null,
      sleepQualityRating: params.sleepQualityRating || null,
      overallHealthRating: params.overallHealthRating || null,
      hasDepressionOrAnxiety: params.hasDepressionOrAnxiety || false,
      noAnswerOnDepressionOrAnxiety: params.noAnswerOnDepressionOrAnxiety || false,
    })

    await this.userJourneySurveyCrudService.upsertUserJourneySurveyByUserId(userId, {
      reverseOrBetterManage: params.reverseOrBetterManage || false,
      loseWeight: params.loseWeight || false,
      improveLabWorkWithoutMedications: params.improveLabWorkWithoutMedications || false,
      feelBetter: params.feelBetter || false,
      lowerHealthcareCost: params.lowerHealthcareCost || false,
      decreaseOrGetOffMedications: params.decreaseOrGetOffMedications || false,
      none: params.none || false,
    })

    await this.userLifestyleSurveyCrudService.upsertUserLifestyleSurveyByUserId(userId, {
      money: params.money || false,
      time: params.time || false,
      energy: params.energy || false,
      socialLife: params.socialLife || false,
      unsureWhatToDo: params.unsureWhatToDo || false,
      emotionalConnectWithFoodDrinks: params.emotionalConnectWithFoodDrinks || false,
      liveHealthyLifestyle: params.liveHealthyLifestyle || false,
      other: params.other || null,
    })
  }
}
