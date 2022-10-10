import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { Public } from '../../decorators/public-route.decorator'

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

@ApiTags('Schedule')
@Public()
@Controller('schedule')
export class ScheduleController {
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

  @Get('import-medications-task')
  public importMedicationsTask() {
    return importMedicationsTask(this.medicationsCrudService)
  }

  @Get('assign-user-target-groups-task')
  public async assignUserTargetGroupsTask() {
    return assignUserTargetGroupsTask(this.userCrudService, this.userTargetGroupsService)
  }

  @Get('assign-user-tracks-task')
  public async assignUserTracksTask() {
    return assignUserTracksTask(this.userCrudService, this.userTracksService)
  }

  @Get('send-custom-notifications-task')
  public sendCustomNotificationsTask() {
    return sendCustomNotifications(
      this.notificationCrudService,
      this.userTargetGroupCrudService,
      this.firebaseService,
      this.userNotificationCrudService,
    )
  }
}
