import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RaceEntity } from '../../../database/entities/race.entity'

import { RaceCrudService } from './race.crud'
import { RaceController } from './race.controller'

@Module({
  imports: [TypeOrmModule.forFeature([RaceEntity])],
  providers: [RaceCrudService],
  controllers: [RaceController],
  exports: [RaceCrudService],
})
export class RaceModule {}
