import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserDevice1660574993131 implements MigrationInterface {
  name = 'UserDevice1660574993131'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_device_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP DEFAULT now(), "fcmToken" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "UQ_b516773415274025df988b736a1" UNIQUE ("fcmToken"), CONSTRAINT "PK_2e4a4598416f7b70b6d125571ad" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_device_entity"`)
  }
}
