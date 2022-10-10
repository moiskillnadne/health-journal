import { NotificationType } from '../../../../constants/enums/notifications.constants'

export interface HandlerInterface {
  getNotificationType(): NotificationType
}

export interface SchedulableHandlerInterface {
  handleNotifications(): Promise<void>
  getNotificationType(): NotificationType
}
