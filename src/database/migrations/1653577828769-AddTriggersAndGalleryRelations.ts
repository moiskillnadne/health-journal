import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTriggersAndGalleryRelations1653577828769 implements MigrationInterface {
  name = 'AddTriggersAndGalleryRelations1653577828769'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "triggers_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "shortName" character varying NOT NULL, "description" text, CONSTRAINT "PK_4155f9c98531d572957e390885d" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "gallery_articles_medications" ("galleryArticleId" uuid NOT NULL, "medicationId" uuid NOT NULL, CONSTRAINT "PK_3cdcad15490ac42a73beae5e8d5" PRIMARY KEY ("galleryArticleId", "medicationId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_cadb4bdd902fdbd090cdfd012d" ON "gallery_articles_medications" ("galleryArticleId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_1a53a265487142e140768e902d" ON "gallery_articles_medications" ("medicationId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "gallery_articles_triggers" ("galleryArticleId" uuid NOT NULL, "triggerId" uuid NOT NULL, CONSTRAINT "PK_ffeaea85ffc7206371949983ef7" PRIMARY KEY ("galleryArticleId", "triggerId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e88a3674c6da5c0f21b4ef4344" ON "gallery_articles_triggers" ("galleryArticleId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_98d3bafdac8b9ec3929387d82b" ON "gallery_articles_triggers" ("triggerId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "gallery_videos_medications" ("galleryVideoId" uuid NOT NULL, "medicationId" uuid NOT NULL, CONSTRAINT "PK_6194c64e9bd02346b37c54d28f8" PRIMARY KEY ("galleryVideoId", "medicationId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_0816dfb625e4693c3eb94152c5" ON "gallery_videos_medications" ("galleryVideoId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_57d755fea4a5765025945caa4e" ON "gallery_videos_medications" ("medicationId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "gallery_videos_triggers" ("galleryVideoId" uuid NOT NULL, "triggerId" uuid NOT NULL, CONSTRAINT "PK_569d63f362e446fad645e86570b" PRIMARY KEY ("galleryVideoId", "triggerId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e30a98ff97f920a74656e35b4d" ON "gallery_videos_triggers" ("galleryVideoId") `,
    )
    await queryRunner.query(`CREATE INDEX "IDX_33d561a87d7456c20411658a83" ON "gallery_videos_triggers" ("triggerId") `)
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" ADD CONSTRAINT "FK_cadb4bdd902fdbd090cdfd012dd" FOREIGN KEY ("galleryArticleId") REFERENCES "gallery_article_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" ADD CONSTRAINT "FK_1a53a265487142e140768e902db" FOREIGN KEY ("medicationId") REFERENCES "medications_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_triggers" ADD CONSTRAINT "FK_e88a3674c6da5c0f21b4ef43444" FOREIGN KEY ("galleryArticleId") REFERENCES "gallery_article_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_triggers" ADD CONSTRAINT "FK_98d3bafdac8b9ec3929387d82bb" FOREIGN KEY ("triggerId") REFERENCES "triggers_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" ADD CONSTRAINT "FK_0816dfb625e4693c3eb94152c51" FOREIGN KEY ("galleryVideoId") REFERENCES "gallery_video_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" ADD CONSTRAINT "FK_57d755fea4a5765025945caa4ec" FOREIGN KEY ("medicationId") REFERENCES "medications_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_triggers" ADD CONSTRAINT "FK_e30a98ff97f920a74656e35b4db" FOREIGN KEY ("galleryVideoId") REFERENCES "gallery_video_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_triggers" ADD CONSTRAINT "FK_33d561a87d7456c20411658a83f" FOREIGN KEY ("triggerId") REFERENCES "triggers_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gallery_videos_triggers" DROP CONSTRAINT "FK_33d561a87d7456c20411658a83f"`)
    await queryRunner.query(`ALTER TABLE "gallery_videos_triggers" DROP CONSTRAINT "FK_e30a98ff97f920a74656e35b4db"`)
    await queryRunner.query(`ALTER TABLE "gallery_videos_medications" DROP CONSTRAINT "FK_57d755fea4a5765025945caa4ec"`)
    await queryRunner.query(`ALTER TABLE "gallery_videos_medications" DROP CONSTRAINT "FK_0816dfb625e4693c3eb94152c51"`)
    await queryRunner.query(`ALTER TABLE "gallery_articles_triggers" DROP CONSTRAINT "FK_98d3bafdac8b9ec3929387d82bb"`)
    await queryRunner.query(`ALTER TABLE "gallery_articles_triggers" DROP CONSTRAINT "FK_e88a3674c6da5c0f21b4ef43444"`)
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" DROP CONSTRAINT "FK_1a53a265487142e140768e902db"`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_medications" DROP CONSTRAINT "FK_cadb4bdd902fdbd090cdfd012dd"`,
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_33d561a87d7456c20411658a83"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_e30a98ff97f920a74656e35b4d"`)
    await queryRunner.query(`DROP TABLE "gallery_videos_triggers"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_57d755fea4a5765025945caa4e"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_0816dfb625e4693c3eb94152c5"`)
    await queryRunner.query(`DROP TABLE "gallery_videos_medications"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_98d3bafdac8b9ec3929387d82b"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_e88a3674c6da5c0f21b4ef4344"`)
    await queryRunner.query(`DROP TABLE "gallery_articles_triggers"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_1a53a265487142e140768e902d"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_cadb4bdd902fdbd090cdfd012d"`)
    await queryRunner.query(`DROP TABLE "gallery_articles_medications"`)
    await queryRunner.query(`DROP TABLE "triggers_entity"`)
  }
}
