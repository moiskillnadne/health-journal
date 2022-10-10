import { StateEntity } from './../../../../database/entities/state.entity'
import { StateEntityService } from './entity/state-entity.service'
import { CountryEntityService } from './entity/country-entity.service'
import { Injectable } from '@nestjs/common'
import { ICountryAPIResponseModel, ICountryRawModel } from '../../../../models/country.models'
import { CountryEntity } from '../../../../database/entities/country.entity'
import { ICityFullDataAPIResponse, IStateFullDataAPIResponse, IStatePrepared } from '../../../../models/state.models'
import axios from 'axios'
import { CityEntityService } from './entity/city-entity.service'
import { CityEntity } from '../../../../database/entities/city.entity'
import { InternalServerError } from '../../../../core/errors/internal-server.error'
import { CityByCountryAndStateDTO } from '../region.dto'

@Injectable()
export class RegionService {
  private UnitedStates_country = 'United States'

  constructor(
    private countryEntityService: CountryEntityService,
    private stateEntityService: StateEntityService,
    private cityEntityService: CityEntityService,
  ) {}

  public async getAllCountries(): Promise<CountryEntity[]> {
    const countries = await this.countryEntityService.getAllCountries()

    // United State should be first in the list
    const newCountriesOrder = countries.reduce((acc, country) => {
      if (country.name === this.UnitedStates_country) {
        return [country, ...acc]
      }

      return [...acc, country]
    }, [])

    return newCountriesOrder
  }

  public async getCountryById(countryId: string): Promise<CountryEntity> {
    return this.countryEntityService.getCountryById(countryId)
  }

  public async getAllStates(): Promise<StateEntity[]> {
    return this.stateEntityService.getAllStates()
  }

  public async getStatesByCountryId(countryId: string): Promise<StateEntity[]> {
    return this.stateEntityService.getStateByCountryId(countryId)
  }

  public async getStateById(stateId: string): Promise<StateEntity> {
    return this.stateEntityService.getStateById(stateId)
  }

  public async getCitiesByCountryId(options: CityByCountryAndStateDTO): Promise<CityEntity[]> {
    const { countryId, stateId } = options

    if (countryId && !stateId) {
      return this.cityEntityService.getCitiesByCountryId(countryId)
    }

    if (!countryId && stateId) {
      return this.cityEntityService.getCitiesByStateId(stateId)
    }

    return this.cityEntityService.getCitiesByCountryAndState(countryId, stateId)
  }

  public async getCityById(cityId: string): Promise<CityEntity> {
    return this.cityEntityService.getCityById(cityId)
  }

  public getAllCities(): Promise<CityEntity[]> {
    return this.cityEntityService.getAllCities()
  }

  public async migrateAllCountriesAndStates() {
    const allCountriesAndStates = await this.getStates()

    const allCountries = allCountriesAndStates.map((countryFullData) => ({
      name: countryFullData.name,
      Iso2: countryFullData.iso2,
      Iso3: countryFullData.iso3,
    }))

    const countriesSaveResult = await this.saveCountry(allCountries)

    const preparedStates = await this.prepareStates(allCountriesAndStates)

    const statesSaveResult = await this.saveState(preparedStates)

    return {
      countriesResult: countriesSaveResult,
      stateResult: statesSaveResult,
    }
  }

  public async migrateCitiesRelatedToStateAndCountry(fromIndex: number, toIndex: number) {
    try {
      const statesWithCountries = await this.stateEntityService.getAllStatesWithCountry()

      const chunkInProcess = statesWithCountries.slice(fromIndex, toIndex)

      const citiesPromises = chunkInProcess.map((item) =>
        this.getCityByCountryAndState({ country: item.country.name, state: item.name }),
      )

      const allCityByStateResults = await Promise.allSettled(citiesPromises)

      const transformed = allCityByStateResults
        .map((item, index) => {
          if (item.status === 'fulfilled') {
            return item['value'].data.map((city) => ({
              name: city,
              country: { id: chunkInProcess[index].country.id },
              state: { id: chunkInProcess[index].id },
            }))
          }
        })
        .flatMap((item) => item)
        .filter((item) => item)

      const insertresult = await this.cityEntityService.saveCity(transformed)
      return {
        count: transformed.length,
        cities: transformed,
        dbResult: insertresult,
      }
    } catch (e) {
      throw new InternalServerError(e)
    }
  }

  public async migrateAllCities() {
    const allCountriesAndCities = await this.getCountriesAndCities()
    const preparedCities = await this.prepareCity(allCountriesAndCities)

    const middleIndex = Math.ceil(preparedCities.length / 2)
    const firstChunk = preparedCities.splice(0, middleIndex)
    const secondChunk = preparedCities.splice(-middleIndex)

    const middleIndexFirstChunk = Math.ceil(firstChunk.length / 2)
    const firstChunk1 = firstChunk.splice(0, middleIndexFirstChunk)
    const firstChunk2 = firstChunk.splice(-middleIndexFirstChunk)

    const middleIndexSecondChunk = Math.ceil(secondChunk.length / 2)
    const secondChunk1 = secondChunk.splice(0, middleIndexSecondChunk)
    const secondChunk2 = secondChunk.splice(-middleIndexSecondChunk)

    const citySaveFirstResult = await this.cityEntityService.saveCity(firstChunk1)
    const citySaveSecondResult = await this.cityEntityService.saveCity(firstChunk2)
    const citySaveThirdResult = await this.cityEntityService.saveCity(secondChunk1)
    const citySaveFourthResult = await this.cityEntityService.saveCity(secondChunk2)

    return {
      citySaveFirstResult,
      citySaveSecondResult,
      citySaveThirdResult,
      citySaveFourthResult,
      length: preparedCities.length,
    }
  }

  private saveCountry(countries: Array<ICountryAPIResponseModel>) {
    const countryPrepared: Array<ICountryRawModel> = countries.map((country) => ({
      name: country.name,
      code: country.Iso2,
    }))

    return this.countryEntityService.saveCountry(countryPrepared)
  }

  private async saveState(isExistInCountries) {
    return this.stateEntityService.saveState(isExistInCountries)
  }

  private async getStates(): Promise<IStateFullDataAPIResponse[]> {
    const config = {
      method: 'get',
      url: 'https://countriesnow.space/api/v0.1/countries/states',
      headers: {},
    }

    const states = await axios(config)

    if (states.data.error) {
      // return API error
    }

    return states.data.data
  }

  private async getCityByCountryAndState(data) {
    const config = {
      method: 'post',
      url: 'https://countriesnow.space/api/v0.1/countries/state/cities',
      headers: {},
      data: data,
    }

    const result = await axios(config)
    return result.data
  }

  private async getCountriesAndCities(): Promise<ICityFullDataAPIResponse[]> {
    const config = {
      method: 'get',
      url: 'https://countriesnow.space/api/v0.1/countries',
      headers: {},
    }

    const result = await axios(config)
    if (result.data.error) {
      // return API error
    }

    return result.data.data
  }

  private async prepareStates(allCountriesAndStates: IStateFullDataAPIResponse[]): Promise<Array<IStatePrepared>> {
    const countries = await this.getAllCountries()

    return allCountriesAndStates.reduce((acc, countryData) => {
      const { name, states } = countryData

      const mappedStates = states.map((state) => ({
        name: state.name,
        code: state.state_code,
        country: { id: countries.find((country) => country.name === name)?.id },
      }))

      return [...acc, ...mappedStates]
    }, [])
  }

  private async prepareCity(allCountiesAndCities: ICityFullDataAPIResponse[]) {
    const counties = await this.getAllCountries()

    return allCountiesAndCities.reduce((acc, city) => {
      const { country: name, cities } = city

      const mappedCities = cities.map((city) => ({
        name: city,
        country: { id: counties.find((country) => country.name === name)?.id },
      }))

      return [...acc, ...mappedCities]
    }, [])
  }
}
