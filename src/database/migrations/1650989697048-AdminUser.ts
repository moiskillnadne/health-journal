import { MigrationInterface, QueryRunner } from 'typeorm'

export class AdminUser1650989697048 implements MigrationInterface {
  name = 'AdminUser1650989697048'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_admin_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "username" character varying NOT NULL, "cognitoId" character varying NOT NULL, "firstName" character varying, "lastName" character varying, CONSTRAINT "UQ_aca4b388e55aade0dd035bf0400" UNIQUE ("email"), CONSTRAINT "UQ_b71bcf305bcb63f8ba0ca1e3b7f" UNIQUE ("username"), CONSTRAINT "UQ_b8c7a4a5542591b3b67b655cd9b" UNIQUE ("cognitoId"), CONSTRAINT "PK_83e665426d3a2a02e9922e12634" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_admin_entity"`)
  }
}
