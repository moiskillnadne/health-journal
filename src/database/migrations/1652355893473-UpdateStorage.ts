import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateStorage1652355893473 implements MigrationInterface {
  name = 'UpdateStorage1652355893473'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "storage_entity" ADD "isPosted" boolean NOT NULL DEFAULT false`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "storage_entity" DROP COLUMN "isPosted"`)
  }
}
