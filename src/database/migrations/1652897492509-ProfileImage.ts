import { MigrationInterface, QueryRunner } from 'typeorm'

export class ProfileImage1652897492509 implements MigrationInterface {
  name = 'ProfileImage1652897492509'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."profile_photo_entity_format_enum" AS ENUM('png', 'jpeg', 'jpg')`)
    await queryRunner.query(
      `CREATE TABLE "profile_photo_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "bucketKey" character varying NOT NULL, "bucketName" character varying NOT NULL, "fileName" character varying NOT NULL, "format" "public"."profile_photo_entity_format_enum" NOT NULL, "location" character varying NOT NULL, "size" integer NOT NULL, "userId" uuid, CONSTRAINT "UQ_a4c0503a6053fdcae52055c6a0f" UNIQUE ("bucketKey"), CONSTRAINT "UQ_41958ee7bfcef6ca21b19599a34" UNIQUE ("location"), CONSTRAINT "REL_af0281b238700e6bb0d6a68f48" UNIQUE ("userId"), CONSTRAINT "PK_663038e9ec5fbd129d9d62668c0" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "profile_photo_entity" ADD CONSTRAINT "FK_af0281b238700e6bb0d6a68f48d" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" DROP CONSTRAINT "FK_af0281b238700e6bb0d6a68f48d"`)
    await queryRunner.query(`DROP TABLE "profile_photo_entity"`)
    await queryRunner.query(`DROP TYPE "public"."profile_photo_entity_format_enum"`)
  }
}
