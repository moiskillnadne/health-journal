import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserWeightDataTypeUpdate1655821021561 implements MigrationInterface {
  name = 'UserWeightDataTypeUpdate1655821021561'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_card_weight_history_entity" DROP COLUMN "weightLb"`)
    await queryRunner.query(`ALTER TABLE "user_card_weight_history_entity" ADD "weightLb" numeric(4,1)`)
    await queryRunner.query(`ALTER TABLE "user_card_weight_history_entity" DROP COLUMN "weightKg"`)
    await queryRunner.query(`ALTER TABLE "user_card_weight_history_entity" ADD "weightKg" numeric(4,1)`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalWeightLb"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalWeightLb" numeric(4,1)`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalWeightKg"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalWeightKg" numeric(4,1)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalWeightKg"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalWeightKg" integer`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalWeightLb"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalWeightLb" double precision`)
    await queryRunner.query(`ALTER TABLE "user_card_weight_history_entity" DROP COLUMN "weightKg"`)
    await queryRunner.query(`ALTER TABLE "user_card_weight_history_entity" ADD "weightKg" integer`)
    await queryRunner.query(`ALTER TABLE "user_card_weight_history_entity" DROP COLUMN "weightLb"`)
    await queryRunner.query(`ALTER TABLE "user_card_weight_history_entity" ADD "weightLb" double precision`)
  }
}
