import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateAdminUser1652713153224 implements MigrationInterface {
  name = 'UpdateAdminUser1652713153224'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_admin_entity" ADD "role" character varying NOT NULL DEFAULT 'content_manager'`,
    )
    await queryRunner.query(`ALTER TABLE "user_admin_entity" ADD "isActive" boolean NOT NULL DEFAULT false`)
    await queryRunner.query(`ALTER TABLE "user_admin_entity" ADD "lastLoginAt" TIMESTAMP`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_admin_entity" DROP COLUMN "lastLoginAt"`)
    await queryRunner.query(`ALTER TABLE "user_admin_entity" DROP COLUMN "isActive"`)
    await queryRunner.query(`ALTER TABLE "user_admin_entity" DROP COLUMN "role"`)
  }
}
