import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserMedicationsEntity } from '../../../database/entities/user-medications.entity'

import { UserMedicationsController } from './user-medications.controller'
import { UserMedicationsService } from './user-medications.service'
import { UserMedicationsCrudService } from './user-medications.crud'

@Module({
  imports: [TypeOrmModule.forFeature([UserMedicationsEntity])],
  providers: [UserMedicationsCrudService, UserMedicationsService],
  controllers: [UserMedicationsController],
  exports: [UserMedicationsCrudService, UserMedicationsService],
})
export class UserMedicationsModule {}
