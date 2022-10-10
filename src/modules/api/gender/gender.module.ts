import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { GenderEntity } from '../../../database/entities/gender.entity'

import { GenderCrudService } from './gender.crud'
import { GenderController } from './gender.controller'

@Module({
  imports: [TypeOrmModule.forFeature([GenderEntity])],
  providers: [GenderCrudService],
  controllers: [GenderController],
  exports: [GenderCrudService],
})
export class GenderModule {}
