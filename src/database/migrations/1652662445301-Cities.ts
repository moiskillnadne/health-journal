import { MigrationInterface, QueryRunner } from 'typeorm'

export class Cities1652662445301 implements MigrationInterface {
  name = 'Cities1652662445301'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "city_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "countryId" uuid, CONSTRAINT "PK_eab9b25f1f37e6d71b416ccdc4e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "city_entity" ADD CONSTRAINT "FK_46514db97b0027dc30c6ebd4267" FOREIGN KEY ("countryId") REFERENCES "country_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "city_entity" DROP CONSTRAINT "FK_46514db97b0027dc30c6ebd4267"`)
    await queryRunner.query(`DROP TABLE "city_entity"`)
  }
}
