import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserCardHba1cPercent1655192363389 implements MigrationInterface {
  name = 'UserCardHba1cPercent1655192363389'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_card_hba1c_history_entity" DROP COLUMN "percent"`)
    await queryRunner.query(`ALTER TABLE "user_card_hba1c_history_entity" ADD "percent" double precision`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_card_hba1c_history_entity" DROP COLUMN "percent"`)
    await queryRunner.query(`ALTER TABLE "user_card_hba1c_history_entity" ADD "percent" integer`)
  }
}
