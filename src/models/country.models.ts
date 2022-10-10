export interface ICountryAPIResponseModel {
  name: string
  Iso2: string
  Iso3: string
}

export interface ICountryRawModel {
  name: string
  code: string
}

export interface ICountryModel extends ICountryRawModel {
  id: string
}
