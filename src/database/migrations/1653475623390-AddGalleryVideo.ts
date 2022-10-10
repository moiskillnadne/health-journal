import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddGalleryVideo1653475623390 implements MigrationInterface {
  name = 'AddGalleryVideo1653475623390'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gallery_video_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "titleEn" character varying NOT NULL, "titleSp" character varying NOT NULL, "keywordsEn" character varying array NOT NULL DEFAULT '{}', "keywordsSp" character varying array NOT NULL DEFAULT '{}', "descriptionEn" text NOT NULL DEFAULT '', "descriptionSp" text NOT NULL DEFAULT '', "isPublished" boolean NOT NULL DEFAULT false, "viewsCount" integer NOT NULL DEFAULT '0', "videoId" uuid, "videoPreviewId" uuid, CONSTRAINT "PK_6a285d8c3ca993dbd8b38cd2f78" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "gallery_videos_conditions" ("galleryVideoId" uuid NOT NULL, "conditionId" uuid NOT NULL, CONSTRAINT "PK_b91a1125265c48384ec234af6c2" PRIMARY KEY ("galleryVideoId", "conditionId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_cdd67e1153a2c9d14d80342d5f" ON "gallery_videos_conditions" ("galleryVideoId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_b8e66ba72ce2f666db74f587eb" ON "gallery_videos_conditions" ("conditionId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_video_entity" ADD CONSTRAINT "FK_0cf66e607001f0e2ed9d3e0be89" FOREIGN KEY ("videoId") REFERENCES "storage_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_video_entity" ADD CONSTRAINT "FK_c2fcb727ff96561bbecbaa636d2" FOREIGN KEY ("videoPreviewId") REFERENCES "storage_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_conditions" ADD CONSTRAINT "FK_cdd67e1153a2c9d14d80342d5fb" FOREIGN KEY ("galleryVideoId") REFERENCES "gallery_video_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_conditions" ADD CONSTRAINT "FK_b8e66ba72ce2f666db74f587eb4" FOREIGN KEY ("conditionId") REFERENCES "conditions_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gallery_videos_conditions" DROP CONSTRAINT "FK_b8e66ba72ce2f666db74f587eb4"`)
    await queryRunner.query(`ALTER TABLE "gallery_videos_conditions" DROP CONSTRAINT "FK_cdd67e1153a2c9d14d80342d5fb"`)
    await queryRunner.query(`ALTER TABLE "gallery_video_entity" DROP CONSTRAINT "FK_c2fcb727ff96561bbecbaa636d2"`)
    await queryRunner.query(`ALTER TABLE "gallery_video_entity" DROP CONSTRAINT "FK_0cf66e607001f0e2ed9d3e0be89"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_b8e66ba72ce2f666db74f587eb"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_cdd67e1153a2c9d14d80342d5f"`)
    await queryRunner.query(`DROP TABLE "gallery_videos_conditions"`)
    await queryRunner.query(`DROP TABLE "gallery_video_entity"`)
  }
}
