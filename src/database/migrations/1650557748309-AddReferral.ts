import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddReferral1650557748309 implements MigrationInterface {
  name = 'AddReferral1650557748309'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "referral" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "referral"`)
  }
}
