import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateGalleryVideo1653659196103 implements MigrationInterface {
  name = 'UpdateGalleryVideo1653659196103'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gallery_video_entity" DROP COLUMN "viewsCount"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gallery_video_entity" ADD "viewsCount" integer NOT NULL DEFAULT '0'`)
  }
}
