import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateRegion1655292321520 implements MigrationInterface {
  name = 'UpdateRegion1655292321520'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_dd2a534c8526f8532bc25093188"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_8e4c8a87991c840b627eaed1445"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_edff7c67ffc739a15d5892041da"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "cityId"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "stateId"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "countryId"`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "country" character varying`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "state" character varying`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "city" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "city"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "state"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "country"`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "countryId" uuid`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "stateId" uuid`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "cityId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_edff7c67ffc739a15d5892041da" FOREIGN KEY ("countryId") REFERENCES "country_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_8e4c8a87991c840b627eaed1445" FOREIGN KEY ("stateId") REFERENCES "state_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_dd2a534c8526f8532bc25093188" FOREIGN KEY ("cityId") REFERENCES "city_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
