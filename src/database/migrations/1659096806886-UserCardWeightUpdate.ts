import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserCardWeightUpdate1659096806886 implements MigrationInterface {
  name = 'UserCardWeightUpdate1659096806886'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_card_weight_history_entity" ALTER COLUMN "weightLb" TYPE numeric(5,1)`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ALTER COLUMN "goalWeightLb" TYPE numeric(5,1)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_card_entity" ALTER COLUMN "goalWeightLb" TYPE numeric(4,1)`)
    await queryRunner.query(`ALTER TABLE "user_card_weight_history_entity" ALTER COLUMN "weightLb" TYPE numeric(4,1)`)
  }
}
