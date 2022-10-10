import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserSettingsNotificationsUpdate1661436699457 implements MigrationInterface {
  name = 'UserSettingsNotificationsUpdate1661436699457'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_settings_notifications_entity" ADD "colonScreeningEnable" boolean NOT NULL DEFAULT true`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_settings_notifications_entity" ADD "mammogramEnable" boolean NOT NULL DEFAULT true`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_settings_notifications_entity" ADD "papSmearEnable" boolean NOT NULL DEFAULT true`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_settings_notifications_entity" DROP COLUMN "papSmearEnable"`)
    await queryRunner.query(`ALTER TABLE "user_settings_notifications_entity" DROP COLUMN "mammogramEnable"`)
    await queryRunner.query(`ALTER TABLE "user_settings_notifications_entity" DROP COLUMN "colonScreeningEnable"`)
  }
}
