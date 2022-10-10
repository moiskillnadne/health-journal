import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixRelations1659956602546 implements MigrationInterface {
  name = 'FixRelations1659956602546'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP CONSTRAINT "FK_566b81e911c361901619d2cb580"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP CONSTRAINT "UQ_566b81e911c361901619d2cb580"`)
    await queryRunner.query(`ALTER TABLE "user_card_entity" DROP COLUMN "profileId"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_bc203ecb3107f67caddc8e899c5"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_bc203ecb3107f67caddc8e899c5"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "lifestyleSurveyId"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_5b07ddfa32c33f4b5fee229f27c"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_5b07ddfa32c33f4b5fee229f27c"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "journeySurveyId"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_134cfdca71c76fa24aa7bee9127"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_134cfdca71c76fa24aa7bee9127"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "cardId"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "lifestyleSurveyId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_bc203ecb3107f67caddc8e899c5" UNIQUE ("lifestyleSurveyId")`,
    )
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "cardId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_134cfdca71c76fa24aa7bee9127" UNIQUE ("cardId")`,
    )
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "journeySurveyId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_5b07ddfa32c33f4b5fee229f27c" UNIQUE ("journeySurveyId")`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_entity" ADD "profileId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "user_card_entity" ADD CONSTRAINT "UQ_566b81e911c361901619d2cb580" UNIQUE ("profileId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_134cfdca71c76fa24aa7bee9127" FOREIGN KEY ("cardId") REFERENCES "user_card_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_5b07ddfa32c33f4b5fee229f27c" FOREIGN KEY ("journeySurveyId") REFERENCES "user_journey_survey_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_bc203ecb3107f67caddc8e899c5" FOREIGN KEY ("lifestyleSurveyId") REFERENCES "user_lifestyle_survey_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_card_entity" ADD CONSTRAINT "FK_566b81e911c361901619d2cb580" FOREIGN KEY ("profileId") REFERENCES "user_card_profile_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
