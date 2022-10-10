import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserMedicationsStatusUpdateColumn1655720564065 implements MigrationInterface {
  name = 'UserMedicationsStatusUpdateColumn1655720564065'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_medications_entity" ADD "statusUpdated" TIMESTAMP WITH TIME ZONE`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_medications_entity" DROP COLUMN "statusUpdated"`)
  }
}
