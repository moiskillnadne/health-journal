import { CountryEntity } from './../database/entities/country.entity'

export interface IStateRawModel {
  name: string
  code: string
  country: CountryEntity
}

export interface ICityRawModel {
  name: string
  country: CountryEntity
}

export interface IStatePrepared {
  name: string
  code: string
  country: {
    name: string
  }
}

export interface ICityPrepared {
  name: string
  country: {
    id: string
  }
  state: {
    id: string
  }
}

export interface IStateAPIResponse {
  name: string
  state_code: string
}

export interface IStateFullDataAPIResponse {
  name: string // Name of country
  iso2: string // Code of country
  iso3: string // Code of country
  states: Array<IStateAPIResponse>
}

export interface ICityFullDataAPIResponse {
  country: string // Name of country
  iso2: string // Code of country
  iso3: string // Code of country
  cities: Array<string>
}
