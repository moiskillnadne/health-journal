import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserCardStepsHistory1656938017591 implements MigrationInterface {
  name = 'UserCardStepsHistory1656938017591'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_card_steps_history_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" uuid NOT NULL, "steps" integer, "datetime" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_484ecc1cdb218ab5d17676a3064" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalSteps" integer`)
    await queryRunner.query(
      `ALTER TABLE "user_card_steps_history_entity" ADD CONSTRAINT "FK_a4a7459bdf12802da055c076593" FOREIGN KEY ("cardId") REFERENCES "user_card_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_card_steps_history_entity" DROP CONSTRAINT "FK_a4a7459bdf12802da055c076593"`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalSteps"`)
    await queryRunner.query(`DROP TABLE "user_card_steps_history_entity"`)
  }
}
