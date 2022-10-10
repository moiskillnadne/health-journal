import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserMedicationStatus1654864349975 implements MigrationInterface {
  name = 'UserMedicationStatus1654864349975'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."user_medications_entity_status_enum" AS ENUM('active', 'inactive')`)
    await queryRunner.query(
      `ALTER TABLE "user_medications_entity" ADD "status" "public"."user_medications_entity_status_enum" DEFAULT 'active'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_medications_entity" DROP COLUMN "status"`)
    await queryRunner.query(`DROP TYPE "public"."user_medications_entity_status_enum"`)
  }
}
