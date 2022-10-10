import { NotificationPredefinedEntity } from '../../../../database/entities/notification-predefined.entity'
import { UserEntity } from '../../../../database/entities/user.entity'
import { UserAppointmentsEntity } from '../../../../database/entities/user-appointments.entity'
import { UserProceduresEntity } from '../../../../database/entities/user-procedures.entity'
import { PredefinedNotificationsSendingStrategy } from '../../notifications.constants'

export class RawPredefinedNotification {
  notification: NotificationPredefinedEntity
  userId: string
  userAppointmentId?: string
  userProcedureId?: string
  sendStrategy?: PredefinedNotificationsSendingStrategy[]
}

export class PreparedPredefinedNotification {
  notification: NotificationPredefinedEntity
  user: UserEntity
  userAppointment?: UserAppointmentsEntity
  userProcedure?: UserProceduresEntity
  sendStrategy: PredefinedNotificationsSendingStrategy[]
}
