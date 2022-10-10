import { MigrationInterface, QueryRunner } from 'typeorm'

export class ProfileImageUpdated1653521034921 implements MigrationInterface {
  name = 'ProfileImageUpdated1653521034921'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" DROP CONSTRAINT "FK_af0281b238700e6bb0d6a68f48d"`)
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" DROP COLUMN "size"`)
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" DROP COLUMN "format"`)
    await queryRunner.query(`DROP TYPE "public"."profile_photo_entity_format_enum"`)
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" DROP CONSTRAINT "UQ_41958ee7bfcef6ca21b19599a34"`)
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" DROP COLUMN "location"`)
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" DROP COLUMN "fileName"`)
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" DROP COLUMN "bucketName"`)
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" DROP CONSTRAINT "UQ_a4c0503a6053fdcae52055c6a0f"`)
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" DROP COLUMN "bucketKey"`)
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" ADD "base64" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" ADD "mimeType" character varying NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "profile_photo_entity" ADD CONSTRAINT "FK_af0281b238700e6bb0d6a68f48d" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" DROP CONSTRAINT "FK_af0281b238700e6bb0d6a68f48d"`)
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" DROP COLUMN "mimeType"`)
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" DROP COLUMN "base64"`)
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" ADD "bucketKey" character varying NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "profile_photo_entity" ADD CONSTRAINT "UQ_a4c0503a6053fdcae52055c6a0f" UNIQUE ("bucketKey")`,
    )
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" ADD "bucketName" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" ADD "fileName" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" ADD "location" character varying NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "profile_photo_entity" ADD CONSTRAINT "UQ_41958ee7bfcef6ca21b19599a34" UNIQUE ("location")`,
    )
    await queryRunner.query(`CREATE TYPE "public"."profile_photo_entity_format_enum" AS ENUM('png', 'jpeg', 'jpg')`)
    await queryRunner.query(
      `ALTER TABLE "profile_photo_entity" ADD "format" "public"."profile_photo_entity_format_enum" NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "profile_photo_entity" ADD "size" integer NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "profile_photo_entity" ADD CONSTRAINT "FK_af0281b238700e6bb0d6a68f48d" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }
}
