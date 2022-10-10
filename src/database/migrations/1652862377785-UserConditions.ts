import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserConditions1652862377785 implements MigrationInterface {
  name = 'UserConditions1652862377785'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_other_conditions_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_26ddd5402c6060402e09eafb2e8" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_conditions_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "conditionId" uuid NOT NULL, "status" character varying, CONSTRAINT "PK_2c3f86839b17209b7d06f3004a7" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "conditions_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" text, CONSTRAINT "PK_a44d4f660f8a6339ab71cd4256e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_other_conditions_entity" ADD CONSTRAINT "FK_6ba7d4a6e299aac1f9c88be599f" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_conditions_entity" ADD CONSTRAINT "FK_7d45c69c576d9397e2497918ed5" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_conditions_entity" ADD CONSTRAINT "FK_3ceddc70b5d9e4d1499cc4f36b7" FOREIGN KEY ("conditionId") REFERENCES "conditions_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_conditions_entity" DROP CONSTRAINT "FK_3ceddc70b5d9e4d1499cc4f36b7"`)
    await queryRunner.query(`ALTER TABLE "user_conditions_entity" DROP CONSTRAINT "FK_7d45c69c576d9397e2497918ed5"`)
    await queryRunner.query(
      `ALTER TABLE "user_other_conditions_entity" DROP CONSTRAINT "FK_6ba7d4a6e299aac1f9c88be599f"`,
    )
    await queryRunner.query(`DROP TABLE "conditions_entity"`)
    await queryRunner.query(`DROP TABLE "user_conditions_entity"`)
    await queryRunner.query(`DROP TABLE "user_other_conditions_entity"`)
  }
}
