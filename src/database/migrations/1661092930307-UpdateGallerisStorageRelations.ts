import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateGallerisStorageRelations1661092930307 implements MigrationInterface {
  name = 'UpdateGallerisStorageRelations1661092930307'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gallery_article_entity" DROP CONSTRAINT "FK_29ccf14008aa1bbcdda093f48fa"`)
    await queryRunner.query(`ALTER TABLE "gallery_video_entity" DROP CONSTRAINT "FK_c2fcb727ff96561bbecbaa636d2"`)
    await queryRunner.query(`ALTER TABLE "gallery_video_entity" DROP CONSTRAINT "FK_0cf66e607001f0e2ed9d3e0be89"`)
    await queryRunner.query(`ALTER TABLE "gallery_recipe_entity" DROP CONSTRAINT "FK_57f7ed8667911eb13bb6afb8a11"`)
    await queryRunner.query(
      `ALTER TABLE "gallery_article_entity" ADD CONSTRAINT "FK_29ccf14008aa1bbcdda093f48fa" FOREIGN KEY ("imageId") REFERENCES "storage_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_video_entity" ADD CONSTRAINT "FK_0cf66e607001f0e2ed9d3e0be89" FOREIGN KEY ("videoId") REFERENCES "storage_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_video_entity" ADD CONSTRAINT "FK_c2fcb727ff96561bbecbaa636d2" FOREIGN KEY ("videoPreviewId") REFERENCES "storage_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_recipe_entity" ADD CONSTRAINT "FK_57f7ed8667911eb13bb6afb8a11" FOREIGN KEY ("imageId") REFERENCES "storage_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gallery_recipe_entity" DROP CONSTRAINT "FK_57f7ed8667911eb13bb6afb8a11"`)
    await queryRunner.query(`ALTER TABLE "gallery_video_entity" DROP CONSTRAINT "FK_c2fcb727ff96561bbecbaa636d2"`)
    await queryRunner.query(`ALTER TABLE "gallery_video_entity" DROP CONSTRAINT "FK_0cf66e607001f0e2ed9d3e0be89"`)
    await queryRunner.query(`ALTER TABLE "gallery_article_entity" DROP CONSTRAINT "FK_29ccf14008aa1bbcdda093f48fa"`)
    await queryRunner.query(
      `ALTER TABLE "gallery_recipe_entity" ADD CONSTRAINT "FK_57f7ed8667911eb13bb6afb8a11" FOREIGN KEY ("imageId") REFERENCES "storage_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_video_entity" ADD CONSTRAINT "FK_0cf66e607001f0e2ed9d3e0be89" FOREIGN KEY ("videoId") REFERENCES "storage_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_video_entity" ADD CONSTRAINT "FK_c2fcb727ff96561bbecbaa636d2" FOREIGN KEY ("videoPreviewId") REFERENCES "storage_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_article_entity" ADD CONSTRAINT "FK_29ccf14008aa1bbcdda093f48fa" FOREIGN KEY ("imageId") REFERENCES "storage_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
