import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUserEntity1658591290467 implements MigrationInterface {
  name = 'UpdateUserEntity1658591290467'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "companyCode" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "companyCode"`)
  }
}
