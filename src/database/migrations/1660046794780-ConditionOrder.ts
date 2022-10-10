import { MigrationInterface, QueryRunner } from 'typeorm'

export class ConditionOrder1660046794780 implements MigrationInterface {
  name = 'ConditionOrder1660046794780'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "conditions_entity" ADD "order" numeric NOT NULL DEFAULT '0'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "conditions_entity" DROP COLUMN "order"`)
  }
}
