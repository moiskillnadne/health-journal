import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CountryEntity } from '../../../../../database/entities/country.entity'
import { ICountryRawModel } from '../../../../../models/country.models'

// https://documenter.getpostman.com/view/1134062/T1LJjU52?version=latest#4a76c2d7-6826-43a3-98b0-18d6d929f414
// curl --location --request GET 'https://countriesnow.space/api/v0.1/countries/iso'
// Data about countries was obtained from here ^

@Injectable()
export class CountryEntityService {
  constructor(
    @InjectRepository(CountryEntity)
    protected countryRepo: Repository<CountryEntity>,
  ) {}

  public saveCountry(countries: Array<ICountryRawModel>) {
    return this.countryRepo.save(countries)
  }

  public getAllCountries(): Promise<CountryEntity[]> {
    return this.countryRepo.find()
  }

  public getCountryByName(name: string): Promise<CountryEntity> {
    return this.countryRepo.findOne({ where: { name } })
  }

  public getCountryById(id: string): Promise<CountryEntity> {
    return this.countryRepo.findOne({ where: { id } })
  }
}
