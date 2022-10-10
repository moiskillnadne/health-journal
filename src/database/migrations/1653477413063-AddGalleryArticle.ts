import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddGalleryArticle1653477413063 implements MigrationInterface {
  name = 'AddGalleryArticle1653477413063'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gallery_article_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "titleEn" character varying NOT NULL, "titleSp" character varying NOT NULL, "summaryEn" character varying NOT NULL, "summarySp" character varying NOT NULL, "keywordsEn" character varying array NOT NULL DEFAULT '{}', "keywordsSp" character varying array NOT NULL DEFAULT '{}', "textEn" text NOT NULL DEFAULT '', "textSp" text NOT NULL DEFAULT '', "isPublished" boolean NOT NULL DEFAULT false, "imageId" uuid, CONSTRAINT "PK_36c2ca4fa42d3268f1eaff09c25" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "gallery_articles_conditions" ("galleryArticleId" uuid NOT NULL, "conditionId" uuid NOT NULL, CONSTRAINT "PK_6d767d6369a895c6f9e644eac9d" PRIMARY KEY ("galleryArticleId", "conditionId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_16a08215e8182062d11b458aec" ON "gallery_articles_conditions" ("galleryArticleId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_65eaf462671a47f061fe8ca65e" ON "gallery_articles_conditions" ("conditionId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_article_entity" ADD CONSTRAINT "FK_29ccf14008aa1bbcdda093f48fa" FOREIGN KEY ("imageId") REFERENCES "storage_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_conditions" ADD CONSTRAINT "FK_16a08215e8182062d11b458aecf" FOREIGN KEY ("galleryArticleId") REFERENCES "gallery_article_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_conditions" ADD CONSTRAINT "FK_65eaf462671a47f061fe8ca65e5" FOREIGN KEY ("conditionId") REFERENCES "conditions_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_conditions" DROP CONSTRAINT "FK_65eaf462671a47f061fe8ca65e5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_articles_conditions" DROP CONSTRAINT "FK_16a08215e8182062d11b458aecf"`,
    )
    await queryRunner.query(`ALTER TABLE "gallery_article_entity" DROP CONSTRAINT "FK_29ccf14008aa1bbcdda093f48fa"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_65eaf462671a47f061fe8ca65e"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_16a08215e8182062d11b458aec"`)
    await queryRunner.query(`DROP TABLE "gallery_articles_conditions"`)
    await queryRunner.query(`DROP TABLE "gallery_article_entity"`)
  }
}
