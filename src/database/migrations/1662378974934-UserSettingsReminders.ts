import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserSettingsReminders1662378974934 implements MigrationInterface {
  name = 'UserSettingsReminders1662378974934'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_settings_reminders_entity_waterperiod_enum" AS ENUM('second', 'minute', 'hour')`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_settings_reminders_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP DEFAULT now(), "userId" uuid NOT NULL, "waterPeriod" "public"."user_settings_reminders_entity_waterperiod_enum", "waterInterval" integer, "waterFrom" TIME, "waterTo" TIME, CONSTRAINT "UQ_bd94450b9a6036f01224bdf2457" UNIQUE ("userId"), CONSTRAINT "REL_bd94450b9a6036f01224bdf245" UNIQUE ("userId"), CONSTRAINT "PK_65a07fd169e93ca4778f3b8fef0" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_settings_reminders_entity" ADD CONSTRAINT "FK_bd94450b9a6036f01224bdf2457" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_settings_reminders_entity" DROP CONSTRAINT "FK_bd94450b9a6036f01224bdf2457"`,
    )
    await queryRunner.query(`DROP TABLE "user_settings_reminders_entity"`)
    await queryRunner.query(`DROP TYPE "public"."user_settings_reminders_entity_waterperiod_enum"`)
  }
}
