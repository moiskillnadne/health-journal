import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserCardAndUserCardWeightHistory1652709738392 implements MigrationInterface {
  name = 'UserCardAndUserCardWeightHistory1652709738392'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_card_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "heightFt" integer, "heightIn" double precision, "heightCm" integer, "goalWeightLb" double precision, "goalWeightKg" integer, "goalPressureSystolic" integer, "goalPressureDiastolic" integer, "goalFastingBloodSugar" integer, "goalAfterMealBloodSugar" integer, CONSTRAINT "UQ_6f05cec6850b24ca5ecac9959ad" UNIQUE ("userId"), CONSTRAINT "REL_6f05cec6850b24ca5ecac9959a" UNIQUE ("userId"), CONSTRAINT "PK_be4b18508eacba3591833cdf23a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_card_weight_history_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" uuid NOT NULL, "weightLb" double precision, "weightKg" integer, CONSTRAINT "PK_9584f9fe6c4a0ddd0bd5eb6d2f4" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "gender" character varying`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "race" character varying`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "cardId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_134cfdca71c76fa24aa7bee9127" UNIQUE ("cardId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_134cfdca71c76fa24aa7bee9127" FOREIGN KEY ("cardId") REFERENCES "user_card_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_entity" ADD CONSTRAINT "FK_6f05cec6850b24ca5ecac9959ad" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_weight_history_entity" ADD CONSTRAINT "FK_dbe101bc86ace7b02b413280d8e" FOREIGN KEY ("cardId") REFERENCES "user_card_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_card_weight_history_entity" DROP CONSTRAINT "FK_dbe101bc86ace7b02b413280d8e"`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP CONSTRAINT "FK_6f05cec6850b24ca5ecac9959ad"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_134cfdca71c76fa24aa7bee9127"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_134cfdca71c76fa24aa7bee9127"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "cardId"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "race"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "gender"`)
    await queryRunner.query(`DROP TABLE "user_card_weight_history_entity"`)
    await queryRunner.query(`DROP TABLE "user_card_entity"`)
  }
}
