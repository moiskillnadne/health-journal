import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserCardParamsDateTypeUpdate1656574545276 implements MigrationInterface {
  name = 'UserCardParamsDateTypeUpdate1656574545276'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_card_weight_history_entity" RENAME COLUMN "date" TO "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_random_blood_sugar_history_entity" RENAME COLUMN "date" TO "datetime"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_fasting_blood_sugar_history_entity" RENAME COLUMN "date" TO "datetime"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_after_meal_blood_sugar_history_entity" RENAME COLUMN "date" TO "datetime"`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_ldl_level_history_entity" RENAME COLUMN "date" TO "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_triglyceride_level_history_entity" RENAME COLUMN "date" TO "datetime"`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_hba1c_history_entity" RENAME COLUMN "date" TO "datetime"`)
    await queryRunner.query(`ALTER TABLE "user_card_blood_pressure_history_entity" RENAME COLUMN "date" TO "datetime"`)
    await queryRunner.query(`ALTER TABLE "user_card_weight_history_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_weight_history_entity" ADD "datetime" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_random_blood_sugar_history_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_random_blood_sugar_history_entity" ADD "datetime" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_fasting_blood_sugar_history_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_fasting_blood_sugar_history_entity" ADD "datetime" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_after_meal_blood_sugar_history_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_after_meal_blood_sugar_history_entity" ADD "datetime" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_ldl_level_history_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_ldl_level_history_entity" ADD "datetime" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_triglyceride_level_history_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_triglyceride_level_history_entity" ADD "datetime" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_hba1c_history_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_hba1c_history_entity" ADD "datetime" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_blood_pressure_history_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_blood_pressure_history_entity" ADD "datetime" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_card_blood_pressure_history_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_blood_pressure_history_entity" ADD "datetime" date NOT NULL DEFAULT ('now'::text)::date`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_hba1c_history_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_hba1c_history_entity" ADD "datetime" date NOT NULL DEFAULT ('now'::text)::date`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_triglyceride_level_history_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_triglyceride_level_history_entity" ADD "datetime" date NOT NULL DEFAULT ('now'::text)::date`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_ldl_level_history_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_ldl_level_history_entity" ADD "datetime" date NOT NULL DEFAULT ('now'::text)::date`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_after_meal_blood_sugar_history_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_after_meal_blood_sugar_history_entity" ADD "datetime" date NOT NULL DEFAULT ('now'::text)::date`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_fasting_blood_sugar_history_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_fasting_blood_sugar_history_entity" ADD "datetime" date NOT NULL DEFAULT ('now'::text)::date`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_random_blood_sugar_history_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_random_blood_sugar_history_entity" ADD "datetime" date NOT NULL DEFAULT ('now'::text)::date`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_weight_history_entity" DROP COLUMN "datetime"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_weight_history_entity" ADD "datetime" date NOT NULL DEFAULT ('now'::text)::date`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_blood_pressure_history_entity" RENAME COLUMN "datetime" TO "date"`)
    await queryRunner.query(`ALTER TABLE "user_card_hba1c_history_entity" RENAME COLUMN "datetime" TO "date"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_triglyceride_level_history_entity" RENAME COLUMN "datetime" TO "date"`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_ldl_level_history_entity" RENAME COLUMN "datetime" TO "date"`)
    await queryRunner.query(
      `ALTER TABLE "user_card_after_meal_blood_sugar_history_entity" RENAME COLUMN "datetime" TO "date"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_fasting_blood_sugar_history_entity" RENAME COLUMN "datetime" TO "date"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_random_blood_sugar_history_entity" RENAME COLUMN "datetime" TO "date"`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_weight_history_entity" RENAME COLUMN "datetime" TO "date"`)
  }
}
