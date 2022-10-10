import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUserEntityAddLastLoginAt1659082835945 implements MigrationInterface {
  name = 'UpdateUserEntityAddLastLoginAt1659082835945'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "lastLoginAt" TIMESTAMP`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "lastLoginAt"`)
  }
}
