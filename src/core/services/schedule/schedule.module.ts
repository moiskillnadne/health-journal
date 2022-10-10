import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule'

import { MedicationsModule } from '../../../modules/api/medications/medications.module'
import { UserModule } from '../../../modules/api/user/user.module'
import { UserTargetGroupsModule } from '../../../modules/api/user-target-groups/user-target-groups.module'
import { UserTracksModule } from '../../../modules/api/user-tracks/user-tracks.module'
import { UserNotificationsModule } from '../../../modules/api/user-notifications/user-notifications.module'
import { AdminModule } from '../../../modules/api/admin/admin.module'
import { FirebaseModule } from '../../../integrations/firebase/firebase.module'

import { ScheduleService } from './schedule.service'
import { ScheduleController } from './schedule.controller'

@Module({
  imports: [
    NestScheduleModule.forRoot(),
    ConfigModule,
    MedicationsModule,
    UserModule,
    UserTargetGroupsModule,
    UserTracksModule,
    AdminModule,
    FirebaseModule,
    UserNotificationsModule,
  ],
  providers: [ScheduleService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
