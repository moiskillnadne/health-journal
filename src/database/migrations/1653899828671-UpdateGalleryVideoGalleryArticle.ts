import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateGalleryVideoGalleryArticle1653899828671 implements MigrationInterface {
  name = 'UpdateGalleryVideoGalleryArticle1653899828671'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" DROP CONSTRAINT "FK_1a53a265487142e140768e902db"`,
    )
    await queryRunner.query(`ALTER TABLE "gallery_videos_medications" DROP CONSTRAINT "FK_57d755fea4a5765025945caa4ec"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_1a53a265487142e140768e902d"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_57d755fea4a5765025945caa4e"`)
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" RENAME COLUMN "medicationId" TO "medicationProductId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" RENAME CONSTRAINT "PK_3cdcad15490ac42a73beae5e8d5" TO "PK_550af43c75f65ae63719c0144a2"`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" RENAME COLUMN "medicationId" TO "medicationProductId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" RENAME CONSTRAINT "PK_6194c64e9bd02346b37c54d28f8" TO "PK_0529ed666819f977e5aea979ff9"`,
    )
    await queryRunner.query(`ALTER TABLE "gallery_video_entity" ADD "viewsCount" integer NOT NULL DEFAULT '0'`)
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" DROP CONSTRAINT "PK_550af43c75f65ae63719c0144a2"`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" ADD CONSTRAINT "PK_cadb4bdd902fdbd090cdfd012dd" PRIMARY KEY ("galleryArticleId")`,
    )
    await queryRunner.query(`ALTER TABLE "gallery_articles_medications" DROP COLUMN "medicationProductId"`)
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" ADD "medicationProductId" character varying NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" DROP CONSTRAINT "PK_cadb4bdd902fdbd090cdfd012dd"`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" ADD CONSTRAINT "PK_550af43c75f65ae63719c0144a2" PRIMARY KEY ("galleryArticleId", "medicationProductId")`,
    )
    await queryRunner.query(`ALTER TABLE "gallery_videos_medications" DROP CONSTRAINT "PK_0529ed666819f977e5aea979ff9"`)
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" ADD CONSTRAINT "PK_0816dfb625e4693c3eb94152c51" PRIMARY KEY ("galleryVideoId")`,
    )
    await queryRunner.query(`ALTER TABLE "gallery_videos_medications" DROP COLUMN "medicationProductId"`)
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" ADD "medicationProductId" character varying NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "gallery_videos_medications" DROP CONSTRAINT "PK_0816dfb625e4693c3eb94152c51"`)
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" ADD CONSTRAINT "PK_0529ed666819f977e5aea979ff9" PRIMARY KEY ("galleryVideoId", "medicationProductId")`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_8e894da9bbea2a3c54e2d83e7d" ON "gallery_articles_medications" ("medicationProductId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_9e780ec1880b3d4a795fe1c220" ON "gallery_videos_medications" ("medicationProductId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" ADD CONSTRAINT "FK_8e894da9bbea2a3c54e2d83e7d1" FOREIGN KEY ("medicationProductId") REFERENCES "medications_entity"("productId") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" ADD CONSTRAINT "FK_9e780ec1880b3d4a795fe1c2200" FOREIGN KEY ("medicationProductId") REFERENCES "medications_entity"("productId") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gallery_videos_medications" DROP CONSTRAINT "FK_9e780ec1880b3d4a795fe1c2200"`)
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" DROP CONSTRAINT "FK_8e894da9bbea2a3c54e2d83e7d1"`,
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_9e780ec1880b3d4a795fe1c220"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_8e894da9bbea2a3c54e2d83e7d"`)
    await queryRunner.query(`ALTER TABLE "gallery_videos_medications" DROP CONSTRAINT "PK_0529ed666819f977e5aea979ff9"`)
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" ADD CONSTRAINT "PK_0816dfb625e4693c3eb94152c51" PRIMARY KEY ("galleryVideoId")`,
    )
    await queryRunner.query(`ALTER TABLE "gallery_videos_medications" DROP COLUMN "medicationProductId"`)
    await queryRunner.query(`ALTER TABLE "gallery_videos_medications" ADD "medicationProductId" uuid NOT NULL`)
    await queryRunner.query(`ALTER TABLE "gallery_videos_medications" DROP CONSTRAINT "PK_0816dfb625e4693c3eb94152c51"`)
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" ADD CONSTRAINT "PK_0529ed666819f977e5aea979ff9" PRIMARY KEY ("galleryVideoId", "medicationProductId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" DROP CONSTRAINT "PK_550af43c75f65ae63719c0144a2"`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" ADD CONSTRAINT "PK_cadb4bdd902fdbd090cdfd012dd" PRIMARY KEY ("galleryArticleId")`,
    )
    await queryRunner.query(`ALTER TABLE "gallery_articles_medications" DROP COLUMN "medicationProductId"`)
    await queryRunner.query(`ALTER TABLE "gallery_articles_medications" ADD "medicationProductId" uuid NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" DROP CONSTRAINT "PK_cadb4bdd902fdbd090cdfd012dd"`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" ADD CONSTRAINT "PK_550af43c75f65ae63719c0144a2" PRIMARY KEY ("galleryArticleId", "medicationProductId")`,
    )
    await queryRunner.query(`ALTER TABLE "gallery_video_entity" DROP COLUMN "viewsCount"`)
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" RENAME CONSTRAINT "PK_0529ed666819f977e5aea979ff9" TO "PK_6194c64e9bd02346b37c54d28f8"`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" RENAME COLUMN "medicationProductId" TO "medicationId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" RENAME CONSTRAINT "PK_550af43c75f65ae63719c0144a2" TO "PK_3cdcad15490ac42a73beae5e8d5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" RENAME COLUMN "medicationProductId" TO "medicationId"`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_57d755fea4a5765025945caa4e" ON "gallery_videos_medications" ("medicationId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_1a53a265487142e140768e902d" ON "gallery_articles_medications" ("medicationId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" ADD CONSTRAINT "FK_57d755fea4a5765025945caa4ec" FOREIGN KEY ("medicationId") REFERENCES "medications_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" ADD CONSTRAINT "FK_1a53a265487142e140768e902db" FOREIGN KEY ("medicationId") REFERENCES "medications_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }
}
