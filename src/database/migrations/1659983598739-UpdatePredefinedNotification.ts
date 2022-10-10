import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdatePredefinedNotification1659983598739 implements MigrationInterface {
  name = 'UpdatePredefinedNotification1659983598739'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_predefined_entity" ADD "isActive" boolean NOT NULL DEFAULT false`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification_predefined_entity" DROP COLUMN "isActive"`)
  }
}
