import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserNotificationsPredefinedCustom1660571066794 implements MigrationInterface {
  name = 'UserNotificationsPredefinedCustom1660571066794'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_notifications_predefined_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP DEFAULT now(), "userId" uuid NOT NULL, "notificationId" uuid NOT NULL, "title" character varying, "bodyEn" text, "bodySp" text, "isViewed" boolean DEFAULT false, "appointmentId" uuid, "procedureId" uuid, CONSTRAINT "PK_f9d7bc102f4c52345b6649ea50a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_notifications_custom_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP DEFAULT now(), "userId" uuid NOT NULL, "notificationId" uuid NOT NULL, "title" character varying, "bodyEn" text, "bodySp" text, "isViewed" boolean DEFAULT false, "imageId" uuid, "videoId" uuid, "articleId" uuid, "recipeId" uuid, CONSTRAINT "PK_e5496db6d41bf101fbb70b8eb54" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "notification_predefined_entity" ADD "type" character varying`)
    await queryRunner.query(
      `CREATE TYPE "public"."notification_predefined_entity_remindperiod_enum" AS ENUM('day', 'week', 'month', 'year')`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification_predefined_entity" ADD "remindPeriod" "public"."notification_predefined_entity_remindperiod_enum"`,
    )
    await queryRunner.query(`ALTER TABLE "notification_predefined_entity" ADD "remindInterval" integer`)
    await queryRunner.query(`ALTER TABLE "notification_predefined_entity" ADD "videoId" uuid`)
    await queryRunner.query(`ALTER TABLE "notification_predefined_entity" ADD "articleId" uuid`)
    await queryRunner.query(`ALTER TABLE "notification_predefined_entity" ADD "recipeId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "notification_predefined_entity" ADD CONSTRAINT "FK_59c9e310dd42446d900a449bccc" FOREIGN KEY ("videoId") REFERENCES "gallery_video_entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification_predefined_entity" ADD CONSTRAINT "FK_3f33004eb7de977103438fa5a5c" FOREIGN KEY ("articleId") REFERENCES "gallery_article_entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification_predefined_entity" ADD CONSTRAINT "FK_87aafcda6fb8df36c41d91fdf67" FOREIGN KEY ("recipeId") REFERENCES "gallery_recipe_entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_predefined_entity" ADD CONSTRAINT "FK_25037e03d0a7b9121950a78a1f5" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_predefined_entity" ADD CONSTRAINT "FK_4af9988bbbdcccc6cb7ba1566e9" FOREIGN KEY ("notificationId") REFERENCES "notification_predefined_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_predefined_entity" ADD CONSTRAINT "FK_77ed3aa6a2677ae8656446e39ee" FOREIGN KEY ("appointmentId") REFERENCES "user_appointments_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_predefined_entity" ADD CONSTRAINT "FK_cc19e223b290757141a49e1eab5" FOREIGN KEY ("procedureId") REFERENCES "user_procedures_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_custom_entity" ADD CONSTRAINT "FK_9a12a523bef74c6802ba46ff2e8" FOREIGN KEY ("imageId") REFERENCES "storage_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_custom_entity" ADD CONSTRAINT "FK_1856600782130db325ca19b3777" FOREIGN KEY ("videoId") REFERENCES "gallery_video_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_custom_entity" ADD CONSTRAINT "FK_a4a645676a6245a074611708976" FOREIGN KEY ("articleId") REFERENCES "gallery_article_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_custom_entity" ADD CONSTRAINT "FK_2d752e84c34ae3b93fdef4a75c1" FOREIGN KEY ("recipeId") REFERENCES "gallery_recipe_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_custom_entity" ADD CONSTRAINT "FK_4ed4bfdb1adbaf7fe76e7b537f2" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_custom_entity" ADD CONSTRAINT "FK_5402f4bf11921e00df1b19fdc81" FOREIGN KEY ("notificationId") REFERENCES "notification_custom_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
    await queryRunner.query(`ALTER TABLE "user_notifications_entity" RENAME TO "user_settings_notifications_entity"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_notifications_custom_entity" DROP CONSTRAINT "FK_5402f4bf11921e00df1b19fdc81"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_custom_entity" DROP CONSTRAINT "FK_4ed4bfdb1adbaf7fe76e7b537f2"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_custom_entity" DROP CONSTRAINT "FK_2d752e84c34ae3b93fdef4a75c1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_custom_entity" DROP CONSTRAINT "FK_a4a645676a6245a074611708976"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_custom_entity" DROP CONSTRAINT "FK_1856600782130db325ca19b3777"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_custom_entity" DROP CONSTRAINT "FK_9a12a523bef74c6802ba46ff2e8"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_predefined_entity" DROP CONSTRAINT "FK_cc19e223b290757141a49e1eab5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_predefined_entity" DROP CONSTRAINT "FK_77ed3aa6a2677ae8656446e39ee"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_predefined_entity" DROP CONSTRAINT "FK_4af9988bbbdcccc6cb7ba1566e9"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_notifications_predefined_entity" DROP CONSTRAINT "FK_25037e03d0a7b9121950a78a1f5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification_predefined_entity" DROP CONSTRAINT "FK_87aafcda6fb8df36c41d91fdf67"`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification_predefined_entity" DROP CONSTRAINT "FK_3f33004eb7de977103438fa5a5c"`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification_predefined_entity" DROP CONSTRAINT "FK_59c9e310dd42446d900a449bccc"`,
    )
    await queryRunner.query(`ALTER TABLE "notification_predefined_entity" DROP COLUMN "recipeId"`)
    await queryRunner.query(`ALTER TABLE "notification_predefined_entity" DROP COLUMN "articleId"`)
    await queryRunner.query(`ALTER TABLE "notification_predefined_entity" DROP COLUMN "videoId"`)
    await queryRunner.query(`ALTER TABLE "notification_predefined_entity" DROP COLUMN "remindInterval"`)
    await queryRunner.query(`ALTER TABLE "notification_predefined_entity" DROP COLUMN "remindPeriod"`)
    await queryRunner.query(`DROP TYPE "public"."notification_predefined_entity_remindperiod_enum"`)
    await queryRunner.query(`ALTER TABLE "notification_predefined_entity" DROP COLUMN "type"`)
    await queryRunner.query(`DROP TABLE "user_notifications_custom_entity"`)
    await queryRunner.query(`DROP TABLE "user_notifications_predefined_entity"`)
    await queryRunner.query(`ALTER TABLE "user_settings_notifications_entity" RENAME TO "user_notifications_entity"`)
  }
}
