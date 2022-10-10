import { MigrationInterface, QueryRunner } from 'typeorm'

export class NotificationPredefinedNotificationCustom1656075016746 implements MigrationInterface {
  name = 'NotificationPredefinedNotificationCustom1656075016746'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification_predefined_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "notification_type" character varying NOT NULL, "name" character varying NOT NULL, "contentEn" text NOT NULL DEFAULT '', "contentSp" text NOT NULL DEFAULT '', "isPublished" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_e6fd2e87766d9097572e35b45c0" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "notification_custom_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "notification_type" character varying NOT NULL DEFAULT 'push_notification', "status" character varying NOT NULL, "name" character varying NOT NULL, "contentEn" text NOT NULL DEFAULT '', "contentSp" text NOT NULL DEFAULT '', "sending_strategy" character varying NOT NULL, "sending_date" TIMESTAMP NOT NULL DEFAULT now(), "imageId" uuid, "videoId" uuid, "articleId" uuid, "recipeId" uuid, CONSTRAINT "PK_65ce721d679dd4bf33c9a271959" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "notifications_custom_target_groups" ("notificationId" uuid NOT NULL, "targetGroupId" uuid NOT NULL, CONSTRAINT "PK_b78516ed1eb92015579a29fa47c" PRIMARY KEY ("notificationId", "targetGroupId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_6723c17dfdf6c5847ddd1ccea7" ON "notifications_custom_target_groups" ("notificationId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_87e02eca07c8e2cf3de8f31635" ON "notifications_custom_target_groups" ("targetGroupId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "notification_custom_entity" ADD CONSTRAINT "FK_4108e81dd25125a92eb61b806a7" FOREIGN KEY ("imageId") REFERENCES "storage_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification_custom_entity" ADD CONSTRAINT "FK_49a9ae0df05b89b1e6592b678ef" FOREIGN KEY ("videoId") REFERENCES "gallery_video_entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification_custom_entity" ADD CONSTRAINT "FK_94fb199ff24009119900a3df1aa" FOREIGN KEY ("articleId") REFERENCES "gallery_article_entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification_custom_entity" ADD CONSTRAINT "FK_5113ac4e9d1de85665667308015" FOREIGN KEY ("recipeId") REFERENCES "gallery_recipe_entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "notifications_custom_target_groups" ADD CONSTRAINT "FK_6723c17dfdf6c5847ddd1ccea75" FOREIGN KEY ("notificationId") REFERENCES "notification_custom_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "notifications_custom_target_groups" ADD CONSTRAINT "FK_87e02eca07c8e2cf3de8f316359" FOREIGN KEY ("targetGroupId") REFERENCES "target_group_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications_custom_target_groups" DROP CONSTRAINT "FK_87e02eca07c8e2cf3de8f316359"`,
    )
    await queryRunner.query(
      `ALTER TABLE "notifications_custom_target_groups" DROP CONSTRAINT "FK_6723c17dfdf6c5847ddd1ccea75"`,
    )
    await queryRunner.query(`ALTER TABLE "notification_custom_entity" DROP CONSTRAINT "FK_5113ac4e9d1de85665667308015"`)
    await queryRunner.query(`ALTER TABLE "notification_custom_entity" DROP CONSTRAINT "FK_5113ac4e9d1de85665667308015"`)
    await queryRunner.query(`ALTER TABLE "notification_custom_entity" DROP CONSTRAINT "FK_94fb199ff24009119900a3df1aa"`)
    await queryRunner.query(`ALTER TABLE "notification_custom_entity" DROP CONSTRAINT "FK_49a9ae0df05b89b1e6592b678ef"`)
    await queryRunner.query(`ALTER TABLE "notification_custom_entity" DROP CONSTRAINT "FK_4108e81dd25125a92eb61b806a7"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_87e02eca07c8e2cf3de8f31635"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_6723c17dfdf6c5847ddd1ccea7"`)
    await queryRunner.query(`DROP TABLE "notifications_custom_target_groups"`)
    await queryRunner.query(`DROP TABLE "notification_custom_entity"`)
    await queryRunner.query(`DROP TABLE "notification_predefined_entity"`)
  }
}
