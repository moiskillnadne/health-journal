import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUserAdminEntity1659512014453 implements MigrationInterface {
  name = 'UpdateUserAdminEntity1659512014453'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_admin_entity" ADD "loginFailedAttemptsCount" integer NOT NULL DEFAULT '0'`,
    )
    await queryRunner.query(`ALTER TABLE "user_admin_entity" ADD "lastLoginAttemptAt" TIMESTAMP`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_admin_entity" DROP COLUMN "lastLoginAttemptAt"`)
    await queryRunner.query(`ALTER TABLE "user_admin_entity" DROP COLUMN "loginFailedAttemptsCount"`)
  }
}
