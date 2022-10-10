import { MigrationInterface, QueryRunner } from 'typeorm'

export class AdditionalInformation1655313743074 implements MigrationInterface {
  name = 'AdditionalInformation1655313743074'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_additional_information_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "value" character varying NOT NULL, CONSTRAINT "REL_3e585e1f69c1a3263ffdd078ef" UNIQUE ("userId"), CONSTRAINT "PK_5abb22871f085ca10903ad47e7e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_additional_information_entity" ADD CONSTRAINT "FK_3e585e1f69c1a3263ffdd078ef1" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_additional_information_entity" DROP CONSTRAINT "FK_3e585e1f69c1a3263ffdd078ef1"`,
    )
    await queryRunner.query(`DROP TABLE "user_additional_information_entity"`)
  }
}
