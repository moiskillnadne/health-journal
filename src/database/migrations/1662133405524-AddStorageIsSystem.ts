import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddStorageIsSystem1662133405524 implements MigrationInterface {
  name = 'AddStorageIsSystem1662133405524'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "storage_entity" ADD "isSystem" boolean NOT NULL DEFAULT false`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "storage_entity" DROP COLUMN "isSystem"`)
  }
}
