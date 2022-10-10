import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserSettings1652516846874 implements MigrationInterface {
  name = 'UserSettings1652516846874'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_settings_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "language" character varying NOT NULL DEFAULT 'EN', "measurementSystem" character varying NOT NULL DEFAULT 'USA', "userId" uuid NOT NULL, CONSTRAINT "REL_346e11b53edfc14949c9806b4d" UNIQUE ("userId"), CONSTRAINT "PK_67ec4d3c93b6ac83cecff4c6493" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_settings_entity" ADD CONSTRAINT "FK_346e11b53edfc14949c9806b4d2" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_settings_entity" DROP CONSTRAINT "FK_346e11b53edfc14949c9806b4d2"`)
    await queryRunner.query(`DROP TABLE "user_settings_entity"`)
  }
}
