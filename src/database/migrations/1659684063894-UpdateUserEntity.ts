import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUserEntity1659684063894 implements MigrationInterface {
  name = 'UpdateUserEntity1659684063894'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "loginFailedAttemptsCount" integer NOT NULL DEFAULT '0'`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "lastLoginAttemptAt" TIMESTAMP`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "lastLoginAttemptAt"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "loginFailedAttemptsCount"`)
  }
}
