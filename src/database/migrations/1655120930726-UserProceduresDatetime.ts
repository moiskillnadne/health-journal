import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserProceduresDatetime1655120930726 implements MigrationInterface {
  name = 'UserProceduresDatetime1655120930726'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" RENAME COLUMN "date" TO "datetime"`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" ADD "datetime" TIMESTAMP WITH TIME ZONE`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" ADD "datetime" date NOT NULL`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" RENAME COLUMN "datetime" TO "date"`)
  }
}
