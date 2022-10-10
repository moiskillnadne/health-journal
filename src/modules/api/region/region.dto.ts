import { DictionaryPathToken } from './../../../constants/dictionary.constants'
import { messageWrapper } from './../../../core/helpers/class-validation'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CountryBodyDTO {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  secretToken: string

  fromIndex: number
  toIndex: number
}

export class StateByCountryDTO {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  countryId: string
}

export class CityByCountryDTO {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  countryId: string
}

export class RegionIdDTO {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  id: string
}

export class CityByCountryAndStateDTO {
  @IsOptional()
  countryId: string

  @IsOptional()
  stateId: string
}
