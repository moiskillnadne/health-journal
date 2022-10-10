import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateGalleryEntities1655727687037 implements MigrationInterface {
  name = 'UpdateGalleryEntities1655727687037'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "track_entity" ALTER COLUMN "titleSp" SET DEFAULT ''`)
    await queryRunner.query(`ALTER TABLE "gallery_recipe_entity" ALTER COLUMN "titleSp" SET DEFAULT ''`)
    await queryRunner.query(`ALTER TABLE "gallery_recipe_entity" ALTER COLUMN "summarySp" SET DEFAULT ''`)
    await queryRunner.query(`ALTER TABLE "gallery_article_entity" ALTER COLUMN "titleSp" SET DEFAULT ''`)
    await queryRunner.query(`ALTER TABLE "gallery_article_entity" ALTER COLUMN "summarySp" SET DEFAULT ''`)
    await queryRunner.query(`ALTER TABLE "gallery_video_entity" ALTER COLUMN "titleSp" SET DEFAULT ''`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gallery_video_entity" ALTER COLUMN "titleSp" DROP DEFAULT`)
    await queryRunner.query(`ALTER TABLE "gallery_article_entity" ALTER COLUMN "summarySp" DROP DEFAULT`)
    await queryRunner.query(`ALTER TABLE "gallery_article_entity" ALTER COLUMN "titleSp" DROP DEFAULT`)
    await queryRunner.query(`ALTER TABLE "gallery_recipe_entity" ALTER COLUMN "summarySp" DROP DEFAULT`)
    await queryRunner.query(`ALTER TABLE "gallery_recipe_entity" ALTER COLUMN "titleSp" DROP DEFAULT`)
    await queryRunner.query(`ALTER TABLE "track_entity" ALTER COLUMN "titleSp" DROP DEFAULT`)
  }
}
