import { MigrationInterface, QueryRunner } from 'typeorm'

export class ProcedureDateColumn1665407064850 implements MigrationInterface {
  name = 'ProcedureDateColumn1665407064850'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" ADD "date" date`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP COLUMN "date"`)
  }
}
