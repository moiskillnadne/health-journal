import { MigrationInterface, QueryRunner } from 'typeorm'

export class NotificationCustomStatusColumnRemove1656672928538 implements MigrationInterface {
  name = 'NotificationCustomStatusColumnRemove1656672928538'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification_custom_entity" DROP COLUMN "status"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification_custom_entity" ADD "status" character varying NOT NULL`)
  }
}
