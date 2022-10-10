import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserProceduresNameColumn1655466007284 implements MigrationInterface {
  name = 'UserProceduresNameColumn1655466007284'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" ADD "name" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP COLUMN "name"`)
  }
}
