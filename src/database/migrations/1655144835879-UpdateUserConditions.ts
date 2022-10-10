import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUserConditions1655144835879 implements MigrationInterface {
  name = 'UpdateUserConditions1655144835879'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_conditions_entity" ADD "conditionResolvedDate" TIMESTAMP`)
    await queryRunner.query(
      `CREATE TYPE "public"."user_other_conditions_entity_status_enum" AS ENUM('current', 'resolved')`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_other_conditions_entity" ADD "status" "public"."user_other_conditions_entity_status_enum" NOT NULL DEFAULT 'current'`,
    )
    await queryRunner.query(`ALTER TABLE "user_other_conditions_entity" ADD "conditionResolvedDate" TIMESTAMP`)
    await queryRunner.query(`ALTER TABLE "user_conditions_entity" DROP COLUMN "status"`)
    await queryRunner.query(`CREATE TYPE "public"."user_conditions_entity_status_enum" AS ENUM('current', 'resolved')`)
    await queryRunner.query(
      `ALTER TABLE "user_conditions_entity" ADD "status" "public"."user_conditions_entity_status_enum" NOT NULL DEFAULT 'current'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_conditions_entity" DROP COLUMN "status"`)
    await queryRunner.query(`DROP TYPE "public"."user_conditions_entity_status_enum"`)
    await queryRunner.query(`ALTER TABLE "user_conditions_entity" ADD "status" character varying`)
    await queryRunner.query(`ALTER TABLE "user_other_conditions_entity" DROP COLUMN "conditionResolvedDate"`)
    await queryRunner.query(`ALTER TABLE "user_other_conditions_entity" DROP COLUMN "status"`)
    await queryRunner.query(`DROP TYPE "public"."user_other_conditions_entity_status_enum"`)
    await queryRunner.query(`ALTER TABLE "user_conditions_entity" DROP COLUMN "conditionResolvedDate"`)
  }
}
