import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUserEntity1660048843012 implements MigrationInterface {
  name = 'UpdateUserEntity1660048843012'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "isEmailConfirmed" boolean NOT NULL DEFAULT false`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "emailConfirmedAt" TIMESTAMP`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "emailConfirmedAt"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "isEmailConfirmed"`)
  }
}
