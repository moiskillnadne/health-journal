import { MigrationInterface, QueryRunner } from 'typeorm'
import { NotificationKind, NotificationType } from '../../constants/enums/notifications.constants'
import { ReminderPeriod } from '../../constants/enums/reminders.constants'

export class OtherProcedureNotification1661883159423 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO notification_predefined_entity("isActive", notification_type, type, name, "contentEn", "contentSp", "remindPeriod", "remindInterval", "procedureId") VALUES
        (true, '${NotificationKind.PushNotification}', '${NotificationType.OtherProcedureToExpire}', 'Other Procedure Reminder', 'You have added your own procedure to VitalOp! This is a reminder that it is time to reschedule this procedure. Please add the scheduled date so we can continue to help you stay on top of your health!', '', '${ReminderPeriod.Week}', 8, '0f379c4b-2b33-4e41-8606-ac6f9f688ea6'),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.OtherProcedureToSchedule}', 'Other Procedure Blank', 'You have added your own procedure to VitalOp! This is a reminder that it is time to reschedule this procedure. Please add the scheduled date so we can continue to help you stay on top of your health!', '', '${ReminderPeriod.Week}', 8, '0f379c4b-2b33-4e41-8606-ac6f9f688ea6');
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE notification_predefined_entity`)
  }
}
