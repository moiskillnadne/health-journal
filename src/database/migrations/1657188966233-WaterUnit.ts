import { MigrationInterface, QueryRunner } from 'typeorm'

export class WaterUnit1657188966233 implements MigrationInterface {
  name = 'WaterUnit1657188966233'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_card_water_history_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" uuid NOT NULL, "waterFloz" double precision NOT NULL, "waterMl" double precision NOT NULL, "datetime" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_3bfc5faea734ff7382bcd2a04a9" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalWaterFloz" double precision`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "goalWaterMl" double precision`)
    await queryRunner.query(
      `ALTER TABLE "user_card_water_history_entity" ADD CONSTRAINT "FK_b012faf8246a4ded9c44baf239f" FOREIGN KEY ("cardId") REFERENCES "user_card_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_card_water_history_entity" DROP CONSTRAINT "FK_b012faf8246a4ded9c44baf239f"`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalWaterMl"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "goalWaterFloz"`)
    await queryRunner.query(`DROP TABLE "user_card_water_history_entity"`)
  }
}
