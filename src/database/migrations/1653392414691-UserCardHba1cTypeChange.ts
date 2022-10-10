import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserCardHba1cTypeChange1653392414691 implements MigrationInterface {
  name = 'UserCardHba1cTypeChange1653392414691'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_card_hba1c_history_entity" ALTER COLUMN "percent" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalHba1c"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalHba1c" double precision`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalHba1c"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalHba1c" integer`)
    await queryRunner.query(`ALTER TABLE "user_card_hba1c_history_entity" ALTER COLUMN "percent" SET NOT NULL`)
  }
}
