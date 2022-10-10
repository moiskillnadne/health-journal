import { Module } from '@nestjs/common'

import { S3Module } from '../../../integrations/s3/s3.module'

import { UserMedicationsModule } from '../user-medications/user-medications.module'
import { UserConditionsModule } from '../user-conditions/user-conditions.module'

import { UserVitalsService } from './user-vitals.service'
import { UserVitalsController } from './user-vitals.controller'

@Module({
  imports: [UserMedicationsModule, UserConditionsModule, S3Module],
  controllers: [UserVitalsController],
  providers: [UserVitalsService],
  exports: [UserVitalsService],
})
export class UserVitalsModule {}
