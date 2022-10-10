import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserRemindersUpdate1660851065908 implements MigrationInterface {
  name = 'UserRemindersUpdate1660851065908'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_reminders_entity" DROP CONSTRAINT "FK_611a747f0e42e6cc2e014a2f2aa"`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP CONSTRAINT "FK_35a0e8c0c347536bbeb1e321ae9"`)
    await queryRunner.query(
      `ALTER TABLE "user_settings_notifications_entity" DROP CONSTRAINT "FK_1cd5330425efae012af8d058cac"`,
    )
    await queryRunner.query(`ALTER TABLE "user_reminders_entity" DROP COLUMN "frequency"`)
    await queryRunner.query(`ALTER TABLE "user_reminders_entity" DROP COLUMN "procedureId"`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP COLUMN "recurrenceMonths"`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP COLUMN "seriesId"`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP COLUMN "recurrenceWeeks"`)
    await queryRunner.query(`ALTER TABLE "user_reminders_entity" ADD "notificationId" uuid NOT NULL`)
    await queryRunner.query(`CREATE TYPE "public"."user_reminders_entity_type_enum" AS ENUM('once', 'repeat')`)
    await queryRunner.query(
      `ALTER TABLE "user_reminders_entity" ADD "type" "public"."user_reminders_entity_type_enum" NOT NULL DEFAULT 'repeat'`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."user_reminders_entity_period_enum" AS ENUM('day', 'week', 'month', 'year')`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_reminders_entity" ADD "period" "public"."user_reminders_entity_period_enum"`,
    )
    await queryRunner.query(`ALTER TABLE "user_reminders_entity" ADD "interval" integer`)
    await queryRunner.query(`ALTER TABLE "user_reminders_entity" ADD "lastExecuteAt" TIMESTAMP WITH TIME ZONE`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" ADD "reminderId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "user_procedures_entity" ADD CONSTRAINT "UQ_5eedef337aaeed33d0b51b73ec9" UNIQUE ("reminderId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_reminders_entity" ADD CONSTRAINT "FK_d1ea4f593c9d89ce9b67e6bb177" FOREIGN KEY ("notificationId") REFERENCES "notification_predefined_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_procedures_entity" ADD CONSTRAINT "FK_35a0e8c0c347536bbeb1e321ae9" FOREIGN KEY ("procedureId") REFERENCES "procedures_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_procedures_entity" ADD CONSTRAINT "FK_5eedef337aaeed33d0b51b73ec9" FOREIGN KEY ("reminderId") REFERENCES "user_reminders_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_settings_notifications_entity" ADD CONSTRAINT "FK_444e661635c9d713f656d97dca7" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_settings_notifications_entity" DROP CONSTRAINT "FK_444e661635c9d713f656d97dca7"`,
    )
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP CONSTRAINT "FK_5eedef337aaeed33d0b51b73ec9"`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP CONSTRAINT "FK_35a0e8c0c347536bbeb1e321ae9"`)
    await queryRunner.query(`ALTER TABLE "user_reminders_entity" DROP CONSTRAINT "FK_d1ea4f593c9d89ce9b67e6bb177"`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP CONSTRAINT "UQ_5eedef337aaeed33d0b51b73ec9"`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP COLUMN "reminderId"`)
    await queryRunner.query(`ALTER TABLE "user_reminders_entity" DROP COLUMN "lastExecuteAt"`)
    await queryRunner.query(`ALTER TABLE "user_reminders_entity" DROP COLUMN "interval"`)
    await queryRunner.query(`ALTER TABLE "user_reminders_entity" DROP COLUMN "period"`)
    await queryRunner.query(`DROP TYPE "public"."user_reminders_entity_period_enum"`)
    await queryRunner.query(`ALTER TABLE "user_reminders_entity" DROP COLUMN "type"`)
    await queryRunner.query(`DROP TYPE "public"."user_reminders_entity_type_enum"`)
    await queryRunner.query(`ALTER TABLE "user_reminders_entity" DROP COLUMN "notificationId"`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" ADD "recurrenceWeeks" integer`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" ADD "seriesId" uuid DEFAULT uuid_generate_v4()`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" ADD "recurrenceMonths" integer`)
    await queryRunner.query(`ALTER TABLE "user_reminders_entity" ADD "procedureId" uuid NOT NULL`)
    await queryRunner.query(`ALTER TABLE "user_reminders_entity" ADD "frequency" character varying`)
    await queryRunner.query(
      `ALTER TABLE "user_settings_notifications_entity" ADD CONSTRAINT "FK_1cd5330425efae012af8d058cac" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_procedures_entity" ADD CONSTRAINT "FK_35a0e8c0c347536bbeb1e321ae9" FOREIGN KEY ("procedureId") REFERENCES "procedures_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_reminders_entity" ADD CONSTRAINT "FK_611a747f0e42e6cc2e014a2f2aa" FOREIGN KEY ("procedureId") REFERENCES "procedures_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
