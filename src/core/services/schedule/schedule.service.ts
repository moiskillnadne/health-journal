import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import {
  scheduleImportMedicationsPeriod,
  scheduleAssignTargetGroupsAndTracksPeriod,
  scheduleCustomNotifications,
} from '../../../constants/enums/schedule.constants'

import { MedicationsCrudService } from '../../../modules/api/medications/medications.crud'

import { UserCrudService } from '../../../modules/api/user/user.crud'
import { UserTargetGroupsService } from '../../../modules/api/user-target-groups/user-target-groups.service'
import { UserTracksService } from '../../../modules/api/user-tracks/user-tracks.service'

import { importMedicationsTask } from './tasks/import-medications.task'
import { assignUserTargetGroupsTask } from './tasks/assign-user-target-groups.task'
import { assignUserTracksTask } from './tasks/assign-user-tracks.task'
import { NotificationCustomCrud } from '../../../modules/api/admin/notification/crud/notification-custom.crud'
import { UserTargetGroupsCrudService } from '../../../modules/api/user-target-groups/user-target-groups.crud'
import { FirebaseService } from '../../../integrations/firebase/firebase.service'
import { sendCustomNotifications } from './tasks/recieve-notifications.task'
import { UserNotificationsCrudService } from '../../../modules/api/user-notifications/user-notifications.crud'

@Injectable()
export class ScheduleService {
  constructor(
    private medicationsCrudService: MedicationsCrudService,
    private userCrudService: UserCrudService,
    private userTargetGroupsService: UserTargetGroupsService,
    private userTracksService: UserTracksService,
    private notificationCrudService: NotificationCustomCrud,
    private userTargetGroupCrudService: UserTargetGroupsCrudService,
    private firebaseService: FirebaseService,
    private userNotificationCrudService: UserNotificationsCrudService,
  ) {}

  @Cron(CronExpression[scheduleImportMedicationsPeriod])
  async importMedicationsTask() {
    await importMedicationsTask(this.medicationsCrudService)
  }

  @Cron(CronExpression[scheduleAssignTargetGroupsAndTracksPeriod])
  async assignTargetGroupsAndTracksTask() {
    await assignUserTargetGroupsTask(this.userCrudService, this.userTargetGroupsService)
    await assignUserTracksTask(this.userCrudService, this.userTracksService)
  }

  @Cron(CronExpression[scheduleCustomNotifications])
  async sendCustomNotification() {
    await sendCustomNotifications(
      this.notificationCrudService,
      this.userTargetGroupCrudService,
      this.firebaseService,
      this.userNotificationCrudService,
    )
  }
}
