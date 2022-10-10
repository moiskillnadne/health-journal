import { StateEntity } from './../../../database/entities/state.entity'
import { ForbiddenError } from './../../../core/errors/forbidden.error'
import { ConfigService } from '@nestjs/config'
import { RegionService } from './services/region.service'
import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { CityByCountryAndStateDTO, CountryBodyDTO } from './region.dto'
import { CountryEntity } from '../../../database/entities/country.entity'
import { Environment } from '../../../constants/config.constants'
import { DictionaryErrorMessages } from '../../../constants/responses/messages.error.constants'
import { CityEntity } from '../../../database/entities/city.entity'

@ApiTags('region')
@Controller('region')
export class RegionController {
  constructor(private regionService: RegionService, protected configService: ConfigService) {}

  @Post('countries-and-states/migration-from-api')
  public saveCountry(@Body() countryBody: CountryBodyDTO) {
    const { secretToken } = countryBody

    if (secretToken !== this.configService.get(Environment.WebAdminAccessToken)) {
      return new ForbiddenError(DictionaryErrorMessages.Forbidden)
    }

    return this.regionService.migrateAllCountriesAndStates()
  }

  @Post('city/migration-from-api')
  public saveCity(@Body() cityBody: CountryBodyDTO) {
    const { secretToken, fromIndex, toIndex } = cityBody

    if (secretToken !== this.configService.get(Environment.WebAdminAccessToken)) {
      return new ForbiddenError(DictionaryErrorMessages.Forbidden)
    }

    return this.regionService.migrateCitiesRelatedToStateAndCountry(fromIndex, toIndex)
  }

  @Get('country/all')
  public getAllCountries(): Promise<CountryEntity[]> {
    return this.regionService.getAllCountries()
  }

  @Get('country/:id')
  public getCountryById(@Param('id') id: string): Promise<CountryEntity> {
    return this.regionService.getCountryById(id)
  }

  @Get('state/:id')
  public getStateById(@Param('id') id: string): Promise<StateEntity> {
    return this.regionService.getStateById(id)
  }

  @Get('city/:id')
  public getCityById(@Param('id') id: string): Promise<CityEntity> {
    return this.regionService.getCityById(id)
  }

  @Get('state/all')
  public getAllStates(): Promise<StateEntity[]> {
    return this.regionService.getAllStates()
  }

  @Get('state/by-country-id/:id')
  public getStateByCountry(@Param('id') id: string) {
    return this.regionService.getStatesByCountryId(id)
  }

  @Get('city/all')
  public getAllCities(): Promise<CityEntity[]> {
    return this.regionService.getAllCities()
  }

  @Get('city')
  public getCityByCountry(@Query() options: CityByCountryAndStateDTO) {
    return this.regionService.getCitiesByCountryId(options)
  }
}
