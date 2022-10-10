import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUserNotifCustomStoragerelation1661251157154 implements MigrationInterface {
  name = 'UpdateUserNotifCustomStoragerelation1661251157154'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_notifications_custom_entity" DROP CONSTRAINT "FK_9a12a523bef74c6802ba46ff2e8"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_custom_entity" ADD CONSTRAINT "FK_9a12a523bef74c6802ba46ff2e8" FOREIGN KEY ("imageId") REFERENCES "storage_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_notifications_custom_entity" DROP CONSTRAINT "FK_9a12a523bef74c6802ba46ff2e8"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_custom_entity" ADD CONSTRAINT "FK_9a12a523bef74c6802ba46ff2e8" FOREIGN KEY ("imageId") REFERENCES "storage_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
