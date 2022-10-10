import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserCardLdlTriglycerideHistory1654800415942 implements MigrationInterface {
  name = 'UserCardLdlTriglycerideHistory1654800415942'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_card_ldl_level_history_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" uuid NOT NULL, "ldlMgDl" integer, "ldlMmolL" double precision, "triglycerideMgDl" integer, "triglycerideMmolL" double precision, "date" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "PK_8cadb751c8fcb72cf2c76be4831" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_card_triglyceride_level_history_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" uuid NOT NULL, "triglycerideMgDl" integer, "triglycerideMmolL" double precision, "date" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "PK_ec0bea4495d3b75ae31f3548530" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalTriglycerideMgDl" integer`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalTriglycerideMmolL" double precision`)
    await queryRunner.query(
      `ALTER TABLE "user_card_ldl_level_history_entity" ADD CONSTRAINT "FK_f3d63d44bdc3687121a54673349" FOREIGN KEY ("cardId") REFERENCES "user_card_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_triglyceride_level_history_entity" ADD CONSTRAINT "FK_159bd5264fc694a69266faf8a0e" FOREIGN KEY ("cardId") REFERENCES "user_card_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_cholesterol_level_history_entity" DROP CONSTRAINT "FK_75b613da581f82c5b7a16688b60"`,
    )
    await queryRunner.query(`DROP TABLE "user_card_cholesterol_level_history_entity"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_card_triglyceride_level_history_entity" DROP CONSTRAINT "FK_159bd5264fc694a69266faf8a0e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_ldl_level_history_entity" DROP CONSTRAINT "FK_f3d63d44bdc3687121a54673349"`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalTriglycerideMmolL"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalTriglycerideMgDl"`)
    await queryRunner.query(`DROP TABLE "user_card_triglyceride_level_history_entity"`)
    await queryRunner.query(`DROP TABLE "user_card_ldl_level_history_entity"`)
    await queryRunner.query(
      `CREATE TABLE "user_card_cholesterol_level_history_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" uuid NOT NULL, "ldlMgDl" integer, "ldlMmolL" double precision, "triglycerideMgDl" integer, "triglycerideMmolL" double precision, "date" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "PK_443eef04aa02d8d3928b984f513" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_cholesterol_level_history_entity" ADD CONSTRAINT "FK_75b613da581f82c5b7a16688b60" FOREIGN KEY ("cardId") REFERENCES "user_card_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }
}
