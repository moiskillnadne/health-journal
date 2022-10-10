import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserVideos1658326081749 implements MigrationInterface {
  name = 'UserVideos1658326081749'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_videos_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "isFavorite" boolean NOT NULL DEFAULT false, "isVisited" boolean NOT NULL DEFAULT false, "isViewed" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "galleryItemId" uuid NOT NULL, CONSTRAINT "PK_83ce31923edb747f386bb807bf5" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_videos_entity" ADD CONSTRAINT "FK_912bc6d69916ab602b6f0c4e083" FOREIGN KEY ("galleryItemId") REFERENCES "gallery_video_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_videos_entity" ADD CONSTRAINT "FK_527bf1c45e22062b36c16bf8e01" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_videos_entity" DROP CONSTRAINT "FK_527bf1c45e22062b36c16bf8e01"`)
    await queryRunner.query(`ALTER TABLE "user_videos_entity" DROP CONSTRAINT "FK_912bc6d69916ab602b6f0c4e083"`)
    await queryRunner.query(`DROP TABLE "user_videos_entity"`)
  }
}
