import { MigrationInterface, QueryRunner } from 'typeorm'

export class GenderAndRace1652784820015 implements MigrationInterface {
  name = 'GenderAndRace1652784820015'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gender_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_9b52f34bc845001f869edeaa980" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "race_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_59a01829457af80d2e3c4f11f30" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "gender"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "race"`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "genderId" uuid`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "raceId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_73894c6307c2aa8aaab0f1d0a26" FOREIGN KEY ("genderId") REFERENCES "gender_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_6d17e95ab8c2a195b9cb5e59456" FOREIGN KEY ("raceId") REFERENCES "race_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_6d17e95ab8c2a195b9cb5e59456"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_73894c6307c2aa8aaab0f1d0a26"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "raceId"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "genderId"`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "race" character varying`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "gender" character varying`)
    await queryRunner.query(`DROP TABLE "race_entity"`)
    await queryRunner.query(`DROP TABLE "gender_entity"`)
  }
}
