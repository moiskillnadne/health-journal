import { CityEntity } from './../../../../../database/entities/city.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ICityPrepared } from '../../../../../models/state.models'

// https://documenter.getpostman.com/view/1134062/T1LJjU52?version=latest#4a76c2d7-6826-43a3-98b0-18d6d929f414
// curl --location --request GET 'https://countriesnow.space/api/v0.1/countries/iso'
// Data about countries was obtained from here ^

@Injectable()
export class CityEntityService {
  constructor(
    @InjectRepository(CityEntity)
    protected cityRepo: Repository<CityEntity>,
  ) {}

  public saveCity(cityInfo: Array<ICityPrepared>) {
    return this.cityRepo.createQueryBuilder().insert().into(CityEntity).values(cityInfo).execute()
  }

  public getAllCities(): Promise<CityEntity[]> {
    return this.cityRepo.find()
  }

  public getCitiesByCountryId(countryId: string): Promise<CityEntity[]> {
    return this.cityRepo.find({ where: { country: { id: countryId } } })
  }

  public getCitiesByStateId(stateId: string): Promise<CityEntity[]> {
    return this.cityRepo.find({ where: { state: { id: stateId } } })
  }

  public getCitiesByCountryAndState(countryId: string, stateId: string): Promise<CityEntity[]> {
    return this.cityRepo.find({ where: { country: { id: countryId }, state: { id: stateId } } })
  }

  public getCityByName(name: string): Promise<CityEntity> {
    return this.cityRepo.findOne({ where: { name } })
  }

  public getCityById(id: string): Promise<CityEntity> {
    return this.cityRepo.findOne({ where: { id } })
  }
}
