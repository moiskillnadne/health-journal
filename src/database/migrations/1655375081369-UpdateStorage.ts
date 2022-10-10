import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateStorage1655375081369 implements MigrationInterface {
  name = 'UpdateStorage1655375081369'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gallery_video_entity" DROP COLUMN "viewsCount"`)
    await queryRunner.query(`ALTER TABLE "storage_entity" ADD "viewsCount" integer NOT NULL DEFAULT '0'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "storage_entity" DROP COLUMN "viewsCount"`)
    await queryRunner.query(`ALTER TABLE "gallery_video_entity" ADD "viewsCount" integer NOT NULL DEFAULT '0'`)
  }
}
