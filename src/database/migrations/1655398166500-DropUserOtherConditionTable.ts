import { MigrationInterface, QueryRunner } from 'typeorm'

export class DropUserOtherConditionTable1655398166500 implements MigrationInterface {
  name = 'DropUserOtherConditionTable1655398166500'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_other_conditions_entity" DROP CONSTRAINT "FK_6ba7d4a6e299aac1f9c88be599f"`,
    )
    await queryRunner.query(`DROP TABLE "user_other_conditions_entity"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_other_conditions_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_26ddd5402c6060402e09eafb2e8" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_other_conditions_entity" ADD CONSTRAINT "FK_6ba7d4a6e299aac1f9c88be599f" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }
}
