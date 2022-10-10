import { MigrationInterface, QueryRunner } from 'typeorm'

export class NotificationPredefinedProcedureColumn1662661792487 implements MigrationInterface {
  name = 'NotificationPredefinedProcedureColumn1662661792487'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification_predefined_entity" ADD "procedureId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "notification_predefined_entity" ADD CONSTRAINT "FK_0246b90a018f341274867e0daa1" FOREIGN KEY ("procedureId") REFERENCES "procedures_entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_predefined_entity" DROP CONSTRAINT "FK_0246b90a018f341274867e0daa1"`,
    )
    await queryRunner.query(`ALTER TABLE "notification_predefined_entity" DROP COLUMN "procedureId"`)
  }
}
