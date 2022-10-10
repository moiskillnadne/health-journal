import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserCardProfileAndBloodPressure1653935805895 implements MigrationInterface {
  name = 'UserCardProfileAndBloodPressure1653935805895'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_card_blood_pressure_history_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" uuid NOT NULL, "pressureSystolicMmHg" integer, "pressureDiastolicMmHg" integer, "date" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "PK_c872a18f666f4a86588f3664594" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_card_profile_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" uuid NOT NULL, "noDiabeticEyeExam" boolean DEFAULT false, "noBloodPressureCheck" boolean DEFAULT false, "needToScheduleAppointment" boolean DEFAULT false, "noScheduledAppointment" boolean DEFAULT false, "noColonScreening" boolean DEFAULT false, "noNeedColonScreening" boolean DEFAULT false, "noPapSmear" boolean DEFAULT false, "noNeedPapSmear" boolean DEFAULT false, "noMammogram" boolean DEFAULT false, "noNeedMammogram" boolean DEFAULT false, CONSTRAINT "UQ_87bdc304aa8bdaaa880948716f6" UNIQUE ("cardId"), CONSTRAINT "REL_87bdc304aa8bdaaa880948716f" UNIQUE ("cardId"), CONSTRAINT "PK_8f94e919065ba461f9247cfa4aa" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalPressureSystolic"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalPressureDiastolic"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalPressureSystolicMmHg" integer`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalPressureDiastolicMmHg" integer`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "profileId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "user_card_entity" ADD CONSTRAINT "UQ_566b81e911c361901619d2cb580" UNIQUE ("profileId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_blood_pressure_history_entity" ADD CONSTRAINT "FK_eafa41a6602770b9c4ab1627afa" FOREIGN KEY ("cardId") REFERENCES "user_card_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_profile_entity" ADD CONSTRAINT "FK_87bdc304aa8bdaaa880948716f6" FOREIGN KEY ("cardId") REFERENCES "user_card_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_entity" ADD CONSTRAINT "FK_566b81e911c361901619d2cb580" FOREIGN KEY ("profileId") REFERENCES "user_card_profile_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP CONSTRAINT "FK_566b81e911c361901619d2cb580"`)
    await queryRunner.query(`ALTER TABLE "user_card_profile_entity" DROP CONSTRAINT "FK_87bdc304aa8bdaaa880948716f6"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_blood_pressure_history_entity" DROP CONSTRAINT "FK_eafa41a6602770b9c4ab1627afa"`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP CONSTRAINT "UQ_566b81e911c361901619d2cb580"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "profileId"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalPressureDiastolicMmHg"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalPressureSystolicMmHg"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalPressureDiastolic" integer`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalPressureSystolic" integer`)
    await queryRunner.query(`DROP TABLE "user_card_profile_entity"`)
    await queryRunner.query(`DROP TABLE "user_card_blood_pressure_history_entity"`)
  }
}
