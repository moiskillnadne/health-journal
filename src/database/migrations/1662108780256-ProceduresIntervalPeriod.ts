import { MigrationInterface, QueryRunner } from 'typeorm'

export class ProceduresIntervalPeriod1662108780256 implements MigrationInterface {
  name = 'ProceduresIntervalPeriod1662108780256'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."procedures_entity_period_enum" AS ENUM('day', 'week', 'month', 'year')`,
    )
    await queryRunner.query(`ALTER TABLE "procedures_entity" ADD "period" "public"."procedures_entity_period_enum"`)
    await queryRunner.query(`ALTER TABLE "procedures_entity" ADD "interval" integer`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "procedures_entity" DROP COLUMN "interval"`)
    await queryRunner.query(`ALTER TABLE "procedures_entity" DROP COLUMN "period"`)
    await queryRunner.query(`DROP TYPE "public"."procedures_entity_period_enum"`)
  }
}
