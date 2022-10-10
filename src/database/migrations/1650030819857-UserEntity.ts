import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserEntity1650030819857 implements MigrationInterface {
  name = 'UserEntity1650030819857'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "username" character varying NOT NULL, "sub" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "dateOfBirth" date, "city" character varying, "state" character varying, "country" character varying, CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username"), CONSTRAINT "UQ_9a43efa5912aa6b732b2ea43cf2" UNIQUE ("sub"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_entity"`)
  }
}
