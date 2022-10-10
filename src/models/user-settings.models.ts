import { Measurements } from './../constants/measurements'
import { Language } from '../constants/language'
import { UserEntity } from '../database/entities/user.entity'

export interface IUserSettingsModel {
  language: Language
  measurementSystem: Measurements
  user: UserEntity
}

export interface IUserSettingsResponse extends IUserSettingsModel {
  id: string
}
