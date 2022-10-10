import { MigrationInterface, QueryRunner } from 'typeorm'

export class NewConditionStructure1655390062781 implements MigrationInterface {
  name = 'NewConditionStructure1655390062781'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_conditions_entity" ADD "info" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_conditions_entity" DROP COLUMN "info"`)
  }
}
