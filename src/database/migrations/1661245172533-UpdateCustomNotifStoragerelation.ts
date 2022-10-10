import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateCustomNotifStoragerelation1661245172533 implements MigrationInterface {
  name = 'UpdateCustomNotifStoragerelation1661245172533'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification_custom_entity" DROP CONSTRAINT "FK_4108e81dd25125a92eb61b806a7"`)
    await queryRunner.query(
      `ALTER TABLE "notification_custom_entity" ADD CONSTRAINT "FK_4108e81dd25125a92eb61b806a7" FOREIGN KEY ("imageId") REFERENCES "storage_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification_custom_entity" DROP CONSTRAINT "FK_4108e81dd25125a92eb61b806a7"`)
    await queryRunner.query(
      `ALTER TABLE "notification_custom_entity" ADD CONSTRAINT "FK_4108e81dd25125a92eb61b806a7" FOREIGN KEY ("imageId") REFERENCES "storage_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
