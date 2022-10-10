import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserArticlesAndRecipes1658239507896 implements MigrationInterface {
  name = 'UserArticlesAndRecipes1658239507896'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_recipes_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "isFavorite" boolean NOT NULL DEFAULT false, "isVisited" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "galleryItemId" uuid NOT NULL, CONSTRAINT "PK_433fc912d6be28e38bd918ab244" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_articles_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "isFavorite" boolean NOT NULL DEFAULT false, "isVisited" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "galleryItemId" uuid NOT NULL, CONSTRAINT "PK_ad95a550758c9158384cab7080c" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_recipes_entity" ADD CONSTRAINT "FK_1c316dce77592018c6cfd8f140e" FOREIGN KEY ("galleryItemId") REFERENCES "gallery_recipe_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_recipes_entity" ADD CONSTRAINT "FK_7d41314de0a2081bcf37c943d1f" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_articles_entity" ADD CONSTRAINT "FK_09145f13ef1f30d0717596f8c1b" FOREIGN KEY ("galleryItemId") REFERENCES "gallery_article_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_articles_entity" ADD CONSTRAINT "FK_3a1cbb12a225093c34c52bf870d" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_articles_entity" DROP CONSTRAINT "FK_3a1cbb12a225093c34c52bf870d"`)
    await queryRunner.query(`ALTER TABLE "user_articles_entity" DROP CONSTRAINT "FK_09145f13ef1f30d0717596f8c1b"`)
    await queryRunner.query(`ALTER TABLE "user_recipes_entity" DROP CONSTRAINT "FK_7d41314de0a2081bcf37c943d1f"`)
    await queryRunner.query(`ALTER TABLE "user_recipes_entity" DROP CONSTRAINT "FK_1c316dce77592018c6cfd8f140e"`)
    await queryRunner.query(`DROP TABLE "user_articles_entity"`)
    await queryRunner.query(`DROP TABLE "user_recipes_entity"`)
  }
}
