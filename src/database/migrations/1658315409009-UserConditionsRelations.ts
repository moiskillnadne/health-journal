import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserConditionsRelations1658315409009 implements MigrationInterface {
  name = 'UserConditionsRelations1658315409009'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_conditions_entity" DROP CONSTRAINT "FK_3ceddc70b5d9e4d1499cc4f36b7"`)
    await queryRunner.query(`ALTER TABLE "gallery_videos_conditions" DROP CONSTRAINT "FK_b8e66ba72ce2f666db74f587eb4"`)
    await queryRunner.query(`ALTER TABLE "gallery_videos_conditions" DROP CONSTRAINT "FK_cdd67e1153a2c9d14d80342d5fb"`)
    await queryRunner.query(
      `ALTER TABLE "user_conditions_entity" ADD CONSTRAINT "FK_3ceddc70b5d9e4d1499cc4f36b7" FOREIGN KEY ("conditionId") REFERENCES "conditions_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_conditions" ADD CONSTRAINT "FK_cdd67e1153a2c9d14d80342d5fb" FOREIGN KEY ("galleryVideoId") REFERENCES "gallery_video_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_conditions" ADD CONSTRAINT "FK_b8e66ba72ce2f666db74f587eb4" FOREIGN KEY ("conditionId") REFERENCES "conditions_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gallery_videos_conditions" DROP CONSTRAINT "FK_b8e66ba72ce2f666db74f587eb4"`)
    await queryRunner.query(`ALTER TABLE "gallery_videos_conditions" DROP CONSTRAINT "FK_cdd67e1153a2c9d14d80342d5fb"`)
    await queryRunner.query(`ALTER TABLE "user_conditions_entity" DROP CONSTRAINT "FK_3ceddc70b5d9e4d1499cc4f36b7"`)
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_conditions" ADD CONSTRAINT "FK_cdd67e1153a2c9d14d80342d5fb" FOREIGN KEY ("galleryVideoId") REFERENCES "gallery_video_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "gallery_videos_conditions" ADD CONSTRAINT "FK_b8e66ba72ce2f666db74f587eb4" FOREIGN KEY ("conditionId") REFERENCES "conditions_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_conditions_entity" ADD CONSTRAINT "FK_3ceddc70b5d9e4d1499cc4f36b7" FOREIGN KEY ("conditionId") REFERENCES "conditions_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
