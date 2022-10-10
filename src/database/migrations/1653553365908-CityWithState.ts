import { MigrationInterface, QueryRunner } from 'typeorm'

export class CityWithState1653553365908 implements MigrationInterface {
  name = 'CityWithState1653553365908'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "city_entity" ADD "stateId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "city_entity" ADD CONSTRAINT "FK_e1dd13dc47887bdeadfcd08b2ef" FOREIGN KEY ("stateId") REFERENCES "state_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "city_entity" DROP CONSTRAINT "FK_e1dd13dc47887bdeadfcd08b2ef"`)
    await queryRunner.query(`ALTER TABLE "city_entity" DROP COLUMN "stateId"`)
  }
}
