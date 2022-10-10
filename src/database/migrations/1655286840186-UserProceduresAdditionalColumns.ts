import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserProceduresAdditionalColumns1655286840186 implements MigrationInterface {
  name = 'UserProceduresAdditionalColumns1655286840186'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" ADD "seriesId" uuid DEFAULT uuid_generate_v4()`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" ADD "recurrenceWeeks" integer`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP COLUMN "recurrenceWeeks"`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP COLUMN "seriesId"`)
  }
}
