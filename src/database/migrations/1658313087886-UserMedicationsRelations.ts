import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserMedicationsRelations1658313087886 implements MigrationInterface {
  name = 'UserMedicationsRelations1658313087886'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_medications_entity" DROP CONSTRAINT "FK_ca51ec8ad5e9602dc1d63266c9a"`)
    await queryRunner.query(`ALTER TABLE "gallery_videos_medications" DROP CONSTRAINT "FK_9e780ec1880b3d4a795fe1c2200"`)
    await queryRunner.query(`ALTER TABLE "gallery_videos_medications" DROP CONSTRAINT "FK_0816dfb625e4693c3eb94152c51"`)
    await queryRunner.query(
      `ALTER TABLE "user_medications_entity" ADD CONSTRAINT "FK_ca51ec8ad5e9602dc1d63266c9a" FOREIGN KEY ("medicationProductId") REFERENCES "medications_entity"("productId") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" ADD CONSTRAINT "FK_0816dfb625e4693c3eb94152c51" FOREIGN KEY ("galleryVideoId") REFERENCES "gallery_video_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" ADD CONSTRAINT "FK_9e780ec1880b3d4a795fe1c2200" FOREIGN KEY ("medicationProductId") REFERENCES "medications_entity"("productId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gallery_videos_medications" DROP CONSTRAINT "FK_9e780ec1880b3d4a795fe1c2200"`)
    await queryRunner.query(`ALTER TABLE "gallery_videos_medications" DROP CONSTRAINT "FK_0816dfb625e4693c3eb94152c51"`)
    await queryRunner.query(`ALTER TABLE "user_medications_entity" DROP CONSTRAINT "FK_ca51ec8ad5e9602dc1d63266c9a"`)
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" ADD CONSTRAINT "FK_0816dfb625e4693c3eb94152c51" FOREIGN KEY ("galleryVideoId") REFERENCES "gallery_video_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_medications" ADD CONSTRAINT "FK_9e780ec1880b3d4a795fe1c2200" FOREIGN KEY ("medicationProductId") REFERENCES "medications_entity"("productId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_medications_entity" ADD CONSTRAINT "FK_ca51ec8ad5e9602dc1d63266c9a" FOREIGN KEY ("medicationProductId") REFERENCES "medications_entity"("productId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
