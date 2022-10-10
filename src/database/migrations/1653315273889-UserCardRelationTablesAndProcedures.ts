import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserCardRelationTablesAndProcedures1653315273889 implements MigrationInterface {
  name = 'UserCardRelationTablesAndProcedures1653315273889'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_card_random_blood_sugar_history_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" uuid NOT NULL, "sugarMgDl" integer, "sugarMmolL" double precision, "date" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "PK_201cb08746d61089f4b32f2838e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_card_fasting_blood_sugar_history_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" uuid NOT NULL, "sugarMgDl" integer, "sugarMmolL" double precision, "date" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "PK_5865cb49e7e922e90c31e621e11" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_card_after_meal_blood_sugar_history_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" uuid NOT NULL, "sugarMgDl" integer, "sugarMmolL" double precision, "date" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "PK_4f20c5c34ce2e1717ae7c060818" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_card_cholesterol_level_history_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" uuid NOT NULL, "ldlMgDl" integer, "ldlMmolL" double precision, "triglycerideMgDl" integer, "triglycerideMmolL" double precision, "date" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "PK_443eef04aa02d8d3928b984f513" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_card_hba1c_history_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" uuid NOT NULL, "percent" integer NOT NULL, "date" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "PK_58b686157a393f36932de7af217" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "procedures_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" text, "tag" character varying, CONSTRAINT "PK_afc2dea1c1b2a46ca6532b5df4d" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_procedures_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "procedureId" uuid NOT NULL, "date" date NOT NULL, CONSTRAINT "PK_e58da64032e41a9539bb64ec479" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalAfterMealBloodSugar"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalFastingBloodSugar"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_weight_history_entity" ADD "date" date NOT NULL DEFAULT ('now'::text)::date`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalHba1c" integer`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalRandomBloodSugarMgDl" integer`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalRandomBloodSugarMmolL" double precision`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalFastingBloodSugarMgDl" integer`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalFastingBloodSugarMmolL" double precision`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalAfterMealBloodSugarMgDl" integer`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalAfterMealBloodSugarMmolL" double precision`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalLdlMgDl" integer`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalLdlMmolL" double precision`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "cpap" boolean`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "heightIn"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "heightIn" integer`)
    await queryRunner.query(`ALTER TABLE "user_admin_entity" ALTER COLUMN "isActive" SET DEFAULT true`)
    await queryRunner.query(
      `ALTER TABLE "user_card_random_blood_sugar_history_entity" ADD CONSTRAINT "FK_dde3ade9359b6691a75b83f8f87" FOREIGN KEY ("cardId") REFERENCES "user_card_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_fasting_blood_sugar_history_entity" ADD CONSTRAINT "FK_ea6b5ea29e5f755d2442f73baee" FOREIGN KEY ("cardId") REFERENCES "user_card_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_after_meal_blood_sugar_history_entity" ADD CONSTRAINT "FK_79a0868ef7c38360f7dcdac4236" FOREIGN KEY ("cardId") REFERENCES "user_card_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_cholesterol_level_history_entity" ADD CONSTRAINT "FK_75b613da581f82c5b7a16688b60" FOREIGN KEY ("cardId") REFERENCES "user_card_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_hba1c_history_entity" ADD CONSTRAINT "FK_74f3bd4ba065bdbf858cac58859" FOREIGN KEY ("cardId") REFERENCES "user_card_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_procedures_entity" ADD CONSTRAINT "FK_d1c714bbd975ecce6ef6a8db06b" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_procedures_entity" ADD CONSTRAINT "FK_35a0e8c0c347536bbeb1e321ae9" FOREIGN KEY ("procedureId") REFERENCES "procedures_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP CONSTRAINT "FK_35a0e8c0c347536bbeb1e321ae9"`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP CONSTRAINT "FK_d1c714bbd975ecce6ef6a8db06b"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_hba1c_history_entity" DROP CONSTRAINT "FK_74f3bd4ba065bdbf858cac58859"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_cholesterol_level_history_entity" DROP CONSTRAINT "FK_75b613da581f82c5b7a16688b60"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_after_meal_blood_sugar_history_entity" DROP CONSTRAINT "FK_79a0868ef7c38360f7dcdac4236"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_fasting_blood_sugar_history_entity" DROP CONSTRAINT "FK_ea6b5ea29e5f755d2442f73baee"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_random_blood_sugar_history_entity" DROP CONSTRAINT "FK_dde3ade9359b6691a75b83f8f87"`,
    )
    await queryRunner.query(`ALTER TABLE "user_admin_entity" ALTER COLUMN "isActive" SET DEFAULT false`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "heightIn"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "heightIn" double precision`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "cpap"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalLdlMmolL"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalLdlMgDl"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalAfterMealBloodSugarMmolL"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalAfterMealBloodSugarMgDl"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalFastingBloodSugarMmolL"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalFastingBloodSugarMgDl"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalRandomBloodSugarMmolL"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalRandomBloodSugarMgDl"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalHba1c"`)
    await queryRunner.query(`ALTER TABLE "user_card_weight_history_entity" DROP COLUMN "date"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalFastingBloodSugar" integer`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalAfterMealBloodSugar" integer`)
    await queryRunner.query(`DROP TABLE "user_procedures_entity"`)
    await queryRunner.query(`DROP TABLE "procedures_entity"`)
    await queryRunner.query(`DROP TABLE "user_card_hba1c_history_entity"`)
    await queryRunner.query(`DROP TABLE "user_card_cholesterol_level_history_entity"`)
    await queryRunner.query(`DROP TABLE "user_card_after_meal_blood_sugar_history_entity"`)
    await queryRunner.query(`DROP TABLE "user_card_fasting_blood_sugar_history_entity"`)
    await queryRunner.query(`DROP TABLE "user_card_random_blood_sugar_history_entity"`)
  }
}
