import { MigrationInterface, QueryRunner } from 'typeorm'

export class Notifications1652979950761 implements MigrationInterface {
  name = 'Notifications1652979950761'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_notifications_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "pushNotificationsEnable" boolean NOT NULL DEFAULT true, "myWellnessJourneytasksEnable" boolean NOT NULL DEFAULT true, "newsAndUpdatesEnable" boolean NOT NULL DEFAULT true, "medicationRemindersEnable" boolean NOT NULL DEFAULT true, "doctorAppointmentsEnable" boolean NOT NULL DEFAULT true, "screeningTestsEnable" boolean NOT NULL DEFAULT true, "eyeExamEnable" boolean NOT NULL DEFAULT true, "scheduleAnAppointmentEnable" boolean NOT NULL DEFAULT true, "vitalsCheckEnable" boolean NOT NULL DEFAULT true, "waterIntakeEnable" boolean NOT NULL DEFAULT true, CONSTRAINT "REL_1cd5330425efae012af8d058ca" UNIQUE ("userId"), CONSTRAINT "PK_d2b16b712124d96da9f0db273be" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "notification_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "tag" character varying NOT NULL, CONSTRAINT "UQ_06429d4aca159d4f89b49bfe5d8" UNIQUE ("name"), CONSTRAINT "UQ_a412f086a92dff71a199c9a5f72" UNIQUE ("tag"), CONSTRAINT "PK_112676de71a3a708b914daed289" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "user_admin_entity" ALTER COLUMN "isActive" SET DEFAULT true`)
    await queryRunner.query(
      `ALTER TABLE "user_notifications_entity" ADD CONSTRAINT "FK_1cd5330425efae012af8d058cac" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_notifications_entity" DROP CONSTRAINT "FK_1cd5330425efae012af8d058cac"`)
    await queryRunner.query(`ALTER TABLE "user_admin_entity" ALTER COLUMN "isActive" SET DEFAULT false`)
    await queryRunner.query(`DROP TABLE "notification_entity"`)
    await queryRunner.query(`DROP TABLE "user_notifications_entity"`)
  }
}
