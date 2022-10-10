import { MigrationInterface, QueryRunner } from 'typeorm'

export class Storage1652256863112 implements MigrationInterface {
  name = 'Storage1652256863112'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "storage_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "bucketKey" character varying NOT NULL, "bucketName" character varying NOT NULL, "contentType" character varying NOT NULL, "fileName" character varying NOT NULL, "format" character varying NOT NULL, "location" character varying NOT NULL, "size" integer NOT NULL, CONSTRAINT "uniq_fileNameContentType" UNIQUE ("fileName", "contentType"), CONSTRAINT "PK_38fdf515dd0e12034143873eeab" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "storage_entity"`)
  }
}
