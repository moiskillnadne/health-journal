import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTrackAndRelated1654790364230 implements MigrationInterface {
  name = 'AddTrackAndRelated1654790364230'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "track_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "titleEn" character varying NOT NULL, "titleSp" character varying NOT NULL, "isPublished" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_9cc0e8a743e689434dac0130098" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "track_group_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "order" integer NOT NULL, "schedule" character varying NOT NULL, "trackId" uuid, CONSTRAINT "PK_92729238261edbe8e3878a28179" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "track_group_line_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "order" integer NOT NULL, "groupId" uuid, "videoId" uuid, "articleId" uuid, "recipeId" uuid, CONSTRAINT "PK_9e7847062a40ba49c684b9d2ad4" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "tracks_target_groups" ("trackId" uuid NOT NULL, "targetGroupId" uuid NOT NULL, CONSTRAINT "PK_eec592d4a9dac72f334dbeaf6a8" PRIMARY KEY ("trackId", "targetGroupId"))`,
    )
    await queryRunner.query(`CREATE INDEX "IDX_b9e300c9879f7e376cfffd8158" ON "tracks_target_groups" ("trackId") `)
    await queryRunner.query(
      `CREATE INDEX "IDX_a3ab021265aed43f9bf6135f29" ON "tracks_target_groups" ("targetGroupId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "track_group_entity" ADD CONSTRAINT "FK_780475935a593ea1edaeb32759d" FOREIGN KEY ("trackId") REFERENCES "track_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "track_group_line_entity" ADD CONSTRAINT "FK_b59247610c053c2a08312960f98" FOREIGN KEY ("groupId") REFERENCES "track_group_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
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
    await queryRunner.query(
      `ALTER TABLE "tracks_target_groups" ADD CONSTRAINT "FK_b9e300c9879f7e376cfffd81584" FOREIGN KEY ("trackId") REFERENCES "track_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "tracks_target_groups" ADD CONSTRAINT "FK_a3ab021265aed43f9bf6135f29b" FOREIGN KEY ("targetGroupId") REFERENCES "target_group_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tracks_target_groups" DROP CONSTRAINT "FK_a3ab021265aed43f9bf6135f29b"`)
    await queryRunner.query(`ALTER TABLE "tracks_target_groups" DROP CONSTRAINT "FK_b9e300c9879f7e376cfffd81584"`)
    await queryRunner.query(`ALTER TABLE "track_group_line_entity" DROP CONSTRAINT "FK_a894c48d6f90540852de52a3897"`)
    await queryRunner.query(`ALTER TABLE "track_group_line_entity" DROP CONSTRAINT "FK_499f14e3c111905fd3ebf547a73"`)
    await queryRunner.query(`ALTER TABLE "track_group_line_entity" DROP CONSTRAINT "FK_a6c21fe6156573d83bb58edacc8"`)
    await queryRunner.query(`ALTER TABLE "track_group_line_entity" DROP CONSTRAINT "FK_b59247610c053c2a08312960f98"`)
    await queryRunner.query(`ALTER TABLE "track_group_entity" DROP CONSTRAINT "FK_780475935a593ea1edaeb32759d"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_a3ab021265aed43f9bf6135f29"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_b9e300c9879f7e376cfffd8158"`)
    await queryRunner.query(`DROP TABLE "tracks_target_groups"`)
    await queryRunner.query(`DROP TABLE "track_group_line_entity"`)
    await queryRunner.query(`DROP TABLE "track_group_entity"`)
    await queryRunner.query(`DROP TABLE "track_entity"`)
  }
}
