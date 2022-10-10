import { CityEntity } from './../../../database/entities/city.entity'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'
import { CountryEntityService } from './services/entity/country-entity.service'
import { RegionService } from './services/region.service'
import { CountryEntity } from './../../../database/entities/country.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { RegionController } from './region.controller'
import { StateEntityService } from './services/entity/state-entity.service'
import { StateEntity } from '../../../database/entities/state.entity'
import { CityEntityService } from './services/entity/city-entity.service'

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([CountryEntity, StateEntity, CityEntity]), HttpModule],
  controllers: [RegionController],
  providers: [RegionService, CountryEntityService, StateEntityService, CityEntityService],
  exports: [],
})
export class RegionModule {}
