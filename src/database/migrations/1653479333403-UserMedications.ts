import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserMedications1653479333403 implements MigrationInterface {
  name = 'UserMedications1653479333403'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_medications_entity_period_enum" AS ENUM('daily', 'weekly', 'monthly', 'yearly')`,
    )
    await queryRunner.query(`CREATE TYPE "public"."user_medications_entity_currency_enum" AS ENUM('usd', 'eur')`)
    await queryRunner.query(
      `CREATE TABLE "user_medications_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "medicationProductId" character varying NOT NULL, "frequency" integer, "period" "public"."user_medications_entity_period_enum", "amount" double precision, "currency" "public"."user_medications_entity_currency_enum", CONSTRAINT "PK_9fa9e66b45f05e4ab4247f609b2" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "medications_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" character varying NOT NULL, "name" character varying NOT NULL, "dose" double precision array, "units" character varying, CONSTRAINT "UQ_a289e0cdd4eced07b0496bc0704" UNIQUE ("productId"), CONSTRAINT "PK_9895efeaae0bcd615231447e98d" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`CREATE INDEX "IDX_365b7f0bff2b2430849fdde329" ON "medications_entity" ("name") `)
    await queryRunner.query(
      `ALTER TABLE "user_medications_entity" ADD CONSTRAINT "FK_3fc5f655cb055ba52688c8be76a" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_medications_entity" ADD CONSTRAINT "FK_ca51ec8ad5e9602dc1d63266c9a" FOREIGN KEY ("medicationProductId") REFERENCES "medications_entity"("productId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_medications_entity" DROP CONSTRAINT "FK_ca51ec8ad5e9602dc1d63266c9a"`)
    await queryRunner.query(`ALTER TABLE "user_medications_entity" DROP CONSTRAINT "FK_3fc5f655cb055ba52688c8be76a"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_365b7f0bff2b2430849fdde329"`)
    await queryRunner.query(`DROP TABLE "medications_entity"`)
    await queryRunner.query(`DROP TABLE "user_medications_entity"`)
    await queryRunner.query(`DROP TYPE "public"."user_medications_entity_currency_enum"`)
    await queryRunner.query(`DROP TYPE "public"."user_medications_entity_period_enum"`)
  }
}
