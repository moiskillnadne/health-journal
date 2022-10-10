import { MigrationInterface, QueryRunner } from 'typeorm'

export class GalleryRelations1660242190308 implements MigrationInterface {
  name = 'GalleryRelations1660242190308'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "track_group_line_entity" DROP CONSTRAINT "FK_a894c48d6f90540852de52a3897"`)
    await queryRunner.query(`ALTER TABLE "track_group_line_entity" DROP CONSTRAINT "FK_499f14e3c111905fd3ebf547a73"`)
    await queryRunner.query(`ALTER TABLE "track_group_line_entity" DROP CONSTRAINT "FK_a6c21fe6156573d83bb58edacc8"`)
    await queryRunner.query(`ALTER TABLE "notification_custom_entity" DROP CONSTRAINT "FK_5113ac4e9d1de85665667308015"`)
    await queryRunner.query(`ALTER TABLE "notification_custom_entity" DROP CONSTRAINT "FK_94fb199ff24009119900a3df1aa"`)
    await queryRunner.query(`ALTER TABLE "notification_custom_entity" DROP CONSTRAINT "FK_49a9ae0df05b89b1e6592b678ef"`)
    await queryRunner.query(
      `ALTER TABLE "track_group_line_entity" ADD CONSTRAINT "FK_a6c21fe6156573d83bb58edacc8" FOREIGN KEY ("videoId") REFERENCES "gallery_video_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "track_group_line_entity" ADD CONSTRAINT "FK_499f14e3c111905fd3ebf547a73" FOREIGN KEY ("articleId") REFERENCES "gallery_article_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "track_group_line_entity" ADD CONSTRAINT "FK_a894c48d6f90540852de52a3897" FOREIGN KEY ("recipeId") REFERENCES "gallery_recipe_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification_custom_entity" ADD CONSTRAINT "FK_49a9ae0df05b89b1e6592b678ef" FOREIGN KEY ("videoId") REFERENCES "gallery_video_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification_custom_entity" ADD CONSTRAINT "FK_94fb199ff24009119900a3df1aa" FOREIGN KEY ("articleId") REFERENCES "gallery_article_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification_custom_entity" ADD CONSTRAINT "FK_5113ac4e9d1de85665667308015" FOREIGN KEY ("recipeId") REFERENCES "gallery_recipe_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification_custom_entity" DROP CONSTRAINT "FK_5113ac4e9d1de85665667308015"`)
    await queryRunner.query(`ALTER TABLE "notification_custom_entity" DROP CONSTRAINT "FK_94fb199ff24009119900a3df1aa"`)
    await queryRunner.query(`ALTER TABLE "notification_custom_entity" DROP CONSTRAINT "FK_49a9ae0df05b89b1e6592b678ef"`)
    await queryRunner.query(`ALTER TABLE "track_group_line_entity" DROP CONSTRAINT "FK_a894c48d6f90540852de52a3897"`)
    await queryRunner.query(`ALTER TABLE "track_group_line_entity" DROP CONSTRAINT "FK_499f14e3c111905fd3ebf547a73"`)
    await queryRunner.query(`ALTER TABLE "track_group_line_entity" DROP CONSTRAINT "FK_a6c21fe6156573d83bb58edacc8"`)
    await queryRunner.query(
      `ALTER TABLE "notification_custom_entity" ADD CONSTRAINT "FK_49a9ae0df05b89b1e6592b678ef" FOREIGN KEY ("videoId") REFERENCES "gallery_video_entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification_custom_entity" ADD CONSTRAINT "FK_94fb199ff24009119900a3df1aa" FOREIGN KEY ("articleId") REFERENCES "gallery_article_entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification_custom_entity" ADD CONSTRAINT "FK_5113ac4e9d1de85665667308015" FOREIGN KEY ("recipeId") REFERENCES "gallery_recipe_entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "track_group_line_entity" ADD CONSTRAINT "FK_a6c21fe6156573d83bb58edacc8" FOREIGN KEY ("videoId") REFERENCES "gallery_video_entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "track_group_line_entity" ADD CONSTRAINT "FK_499f14e3c111905fd3ebf547a73" FOREIGN KEY ("articleId") REFERENCES "gallery_article_entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "track_group_line_entity" ADD CONSTRAINT "FK_a894c48d6f90540852de52a3897" FOREIGN KEY ("recipeId") REFERENCES "gallery_recipe_entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    )
  }
}
