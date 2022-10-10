import { Measurements } from './../../../../../constants/measurements'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { UserSettingsEntity } from '../../../../../database/entities/user-settings.entity'
import { Repository } from 'typeorm'
import { Language } from '../../../../../constants/language'

@Injectable()
export class UserSettingsEntityService {
  constructor(
    @InjectRepository(UserSettingsEntity)
    protected settingsRepo: Repository<UserSettingsEntity>,
  ) {}

  public getUserSettingsByID(id: string) {
    return this.settingsRepo.findOne({
      where: { id },
    })
  }

  public getUserSettingsByUserId(userId: string) {
    return this.settingsRepo.findOne({ where: { user: { id: userId } } })
  }

  public createInitialSettings(userId: string) {
    return this.settingsRepo.save({ user: { id: userId } })
  }

  public setUserLanguage(userId: string, language: Language) {
    return this.settingsRepo.save({ language, user: { id: userId } })
  }

  public setUserMeasurements(userId: string, measurementSystem: Measurements) {
    return this.settingsRepo.save({ measurementSystem, user: { id: userId } })
  }

  public updateLanguageByUserId(userId: string, language: Language) {
    return this.settingsRepo.update({ user: { id: userId } }, { language })
  }

  public updateMeasurementsByUserId(userId: string, measurement: Measurements) {
    return this.settingsRepo.update({ user: { id: userId } }, { measurementSystem: measurement })
  }
}
