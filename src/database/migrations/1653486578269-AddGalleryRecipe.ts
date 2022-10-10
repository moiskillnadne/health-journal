import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddGalleryRecipe1653486578269 implements MigrationInterface {
  name = 'AddGalleryRecipe1653486578269'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gallery_recipe_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "titleEn" character varying NOT NULL, "titleSp" character varying NOT NULL, "summaryEn" character varying NOT NULL, "summarySp" character varying NOT NULL, "keywordsEn" character varying array NOT NULL DEFAULT '{}', "keywordsSp" character varying array NOT NULL DEFAULT '{}', "textEn" text NOT NULL DEFAULT '', "textSp" text NOT NULL DEFAULT '', "isPublished" boolean NOT NULL DEFAULT false, "imageId" uuid, CONSTRAINT "PK_ba9860464f9574af4074a9d43d4" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_recipe_entity" ADD CONSTRAINT "FK_57f7ed8667911eb13bb6afb8a11" FOREIGN KEY ("imageId") REFERENCES "storage_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gallery_recipe_entity" DROP CONSTRAINT "FK_57f7ed8667911eb13bb6afb8a11"`)
    await queryRunner.query(`DROP TABLE "gallery_recipe_entity"`)
  }
}
