import { StateEntity } from './../../../../../database/entities/state.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IStatePrepared } from '../../../../../models/state.models'

// https://documenter.getpostman.com/view/1134062/T1LJjU52?version=latest#4a76c2d7-6826-43a3-98b0-18d6d929f414
// curl --location --request GET 'https://countriesnow.space/api/v0.1/countries/iso'
// Data about countries was obtained from here ^

@Injectable()
export class StateEntityService {
  constructor(
    @InjectRepository(StateEntity)
    protected stateRepo: Repository<StateEntity>,
  ) {}

  public saveState(stateInfo: Array<IStatePrepared>) {
    return this.stateRepo.save(stateInfo)
  }

  public getAllStates(): Promise<StateEntity[]> {
    return this.stateRepo.find()
  }

  public getAllStatesWithCountry() {
    return this.stateRepo.find({ relations: ['country'] })
  }

  public getStateByCountryId(countryId: string): Promise<StateEntity[]> {
    return this.stateRepo.find({ where: { country: { id: countryId } } })
  }

  public getStateByName(name: string): Promise<StateEntity> {
    return this.stateRepo.findOne({ where: { name } })
  }

  public getStateById(id: string): Promise<StateEntity> {
    return this.stateRepo.findOne({ where: { id } })
  }
}
