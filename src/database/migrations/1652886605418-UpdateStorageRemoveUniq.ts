import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateStorageRemoveUniq1652886605418 implements MigrationInterface {
  name = 'UpdateStorageRemoveUniq1652886605418'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "storage_entity" DROP CONSTRAINT "uniq_fileNameContentType"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "storage_entity" ADD CONSTRAINT "uniq_fileNameContentType" UNIQUE ("contentType", "fileName")`,
    )
  }
}
