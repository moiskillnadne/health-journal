import { MigrationInterface, QueryRunner } from 'typeorm'

export class SleepUnit1656965015820 implements MigrationInterface {
  name = 'SleepUnit1656965015820'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_card_sleep_history_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" uuid NOT NULL, "sleepHours" numeric(4,1) NOT NULL, "datetime" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_1e90cbf7490468ba20ad9290a51" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "sleepGoal" numeric(4,1)`)
    await queryRunner.query(
      `ALTER TABLE "user_card_sleep_history_entity" ADD CONSTRAINT "FK_f797153c48e30ba8262696871f7" FOREIGN KEY ("cardId") REFERENCES "user_card_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_card_sleep_history_entity" DROP CONSTRAINT "FK_f797153c48e30ba8262696871f7"`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "sleepGoal"`)
    await queryRunner.query(`DROP TABLE "user_card_sleep_history_entity"`)
  }
}
