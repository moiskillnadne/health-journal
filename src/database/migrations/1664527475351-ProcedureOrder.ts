import { MigrationInterface, QueryRunner } from 'typeorm'

export class ProcedureOrder1664527475351 implements MigrationInterface {
  name = 'ProcedureOrder1664527475351'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "procedures_entity" ADD "order" integer`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "procedures_entity" DROP COLUMN "order"`)
  }
}
