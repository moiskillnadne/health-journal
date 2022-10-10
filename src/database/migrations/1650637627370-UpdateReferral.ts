import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateReferral1650637627370 implements MigrationInterface {
  name = 'UpdateReferral1650637627370'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" RENAME COLUMN "referral" TO "referralId"`)
    await queryRunner.query(
      `CREATE TABLE "referral_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "value" character varying, CONSTRAINT "PK_188c5a14d6d2d18166f13014287" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "referralId"`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "referralId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_680339893a5284d0aab5aa29d91" UNIQUE ("referralId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_680339893a5284d0aab5aa29d91" FOREIGN KEY ("referralId") REFERENCES "referral_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_680339893a5284d0aab5aa29d91"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_680339893a5284d0aab5aa29d91"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "referralId"`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "referralId" character varying`)
    await queryRunner.query(`DROP TABLE "referral_entity"`)
    await queryRunner.query(`ALTER TABLE "user_entity" RENAME COLUMN "referralId" TO "referral"`)
  }
}
