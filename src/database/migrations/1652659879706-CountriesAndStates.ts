import { MigrationInterface, QueryRunner } from 'typeorm'

export class CountriesAndStates1652659879706 implements MigrationInterface {
  name = 'CountriesAndStates1652659879706'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "country_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying NOT NULL, CONSTRAINT "PK_c660a2aefbb90e5d4f531bfe84f" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "state_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying, "countryId" uuid, CONSTRAINT "PK_e77772ccfefb719c6206c04f2cb" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "state_entity" ADD CONSTRAINT "FK_0c597183299f5379d69c5a43c3d" FOREIGN KEY ("countryId") REFERENCES "country_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "state_entity" DROP CONSTRAINT "FK_0c597183299f5379d69c5a43c3d"`)
    await queryRunner.query(`DROP TABLE "state_entity"`)
    await queryRunner.query(`DROP TABLE "country_entity"`)
  }
}
