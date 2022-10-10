import { MigrationInterface, QueryRunner } from 'typeorm'

export class Food1658911677510 implements MigrationInterface {
  name = 'Food1658911677510'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "food_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "bucketKey" character varying NOT NULL, "bucketName" character varying NOT NULL, "contentType" character varying NOT NULL, "fileName" character varying NOT NULL, "format" character varying NOT NULL, "location" character varying NOT NULL, "size" integer NOT NULL, "videoPreviewId" uuid, CONSTRAINT "PK_7a42d197fa2c45973b61ee7bfb4" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "food_entity" ADD CONSTRAINT "FK_4afdfb8d8591b4ec00f4cba595d" FOREIGN KEY ("videoPreviewId") REFERENCES "storage_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "food_entity" DROP CONSTRAINT "FK_4afdfb8d8591b4ec00f4cba595d"`)
    await queryRunner.query(`DROP TABLE "food_entity"`)
  }
}
