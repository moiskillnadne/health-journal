import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MedicationsEntity } from '../../../database/entities/medications.entity'

import { MedicationsController } from './medications.controller'
import { MedicationsService } from './medications.service'
import { MedicationsCrudService } from './medications.crud'

@Module({
  imports: [TypeOrmModule.forFeature([MedicationsEntity])],
  providers: [MedicationsCrudService, MedicationsService],
  controllers: [MedicationsController],
  exports: [MedicationsCrudService, MedicationsService],
})
export class MedicationsModule {}
