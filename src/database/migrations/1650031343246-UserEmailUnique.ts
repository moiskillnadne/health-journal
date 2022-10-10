import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserEmailUnique1650031343246 implements MigrationInterface {
  name = 'UserEmailUnique1650031343246'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5"`)
  }
}
