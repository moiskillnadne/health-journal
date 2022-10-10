import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTargetGroup1654788377302 implements MigrationInterface {
  name = 'AddTargetGroup1654788377302'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "target_group_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, CONSTRAINT "PK_fead0c8ec26afdd8ec03eea906b" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "target_group_entity"`)
  }
}
