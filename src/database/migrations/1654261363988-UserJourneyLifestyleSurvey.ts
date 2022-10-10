import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserJourneyLifestyleSurvey1654261363988 implements MigrationInterface {
  name = 'UserJourneyLifestyleSurvey1654261363988'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_journey_survey_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "reverseOrBetterManage" boolean DEFAULT false, "loseWeight" boolean DEFAULT false, "improveLabWorkWithoutMedications" boolean DEFAULT false, "feelBetter" boolean DEFAULT false, "lowerHealthcareCost" boolean DEFAULT false, "decreaseOrGetOffMedications" boolean DEFAULT false, "none" boolean DEFAULT false, CONSTRAINT "REL_31923fb0743f357d0055364ab2" UNIQUE ("userId"), CONSTRAINT "PK_095c7a830ef368374ed2a0d3ee6" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_lifestyle_survey_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "money" boolean DEFAULT false, "time" boolean DEFAULT false, "energy" boolean DEFAULT false, "socialLife" boolean DEFAULT false, "unsureWhatToDo" boolean DEFAULT false, "emotionalConnectWithFoodDrinks" boolean DEFAULT false, "liveHealthyLifestyle" boolean DEFAULT false, "other" character varying, CONSTRAINT "REL_f8b25bc2d65fd333f5eec52e06" UNIQUE ("userId"), CONSTRAINT "PK_25e1ecb4767dce251a699dfdcc2" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "user_card_profile_entity" ADD "averageDailyWaterIntake" integer`)
    await queryRunner.query(`ALTER TABLE "user_card_profile_entity" ADD "averageDailySleepHours" double precision`)
    await queryRunner.query(`ALTER TABLE "user_card_profile_entity" ADD "sleepQualityRating" integer`)
    await queryRunner.query(`ALTER TABLE "user_card_profile_entity" ADD "overallHealthRating" integer`)
    await queryRunner.query(`ALTER TABLE "user_card_profile_entity" ADD "hasDepressionOrAnxiety" boolean DEFAULT false`)
    await queryRunner.query(
      `ALTER TABLE "user_card_profile_entity" ADD "noAnswerOnDepressionOrAnxiety" boolean DEFAULT false`,
    )
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "journeySurveyId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_5b07ddfa32c33f4b5fee229f27c" UNIQUE ("journeySurveyId")`,
    )
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "lifestyleSurveyId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_bc203ecb3107f67caddc8e899c5" UNIQUE ("lifestyleSurveyId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_journey_survey_entity" ADD CONSTRAINT "FK_31923fb0743f357d0055364ab23" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_lifestyle_survey_entity" ADD CONSTRAINT "FK_f8b25bc2d65fd333f5eec52e06f" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_5b07ddfa32c33f4b5fee229f27c" FOREIGN KEY ("journeySurveyId") REFERENCES "user_journey_survey_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_bc203ecb3107f67caddc8e899c5" FOREIGN KEY ("lifestyleSurveyId") REFERENCES "user_lifestyle_survey_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_bc203ecb3107f67caddc8e899c5"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_5b07ddfa32c33f4b5fee229f27c"`)
    await queryRunner.query(
      `ALTER TABLE "user_lifestyle_survey_entity" DROP CONSTRAINT "FK_f8b25bc2d65fd333f5eec52e06f"`,
    )
    await queryRunner.query(`ALTER TABLE "user_journey_survey_entity" DROP CONSTRAINT "FK_31923fb0743f357d0055364ab23"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_bc203ecb3107f67caddc8e899c5"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "lifestyleSurveyId"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_5b07ddfa32c33f4b5fee229f27c"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "journeySurveyId"`)
    await queryRunner.query(`ALTER TABLE "user_card_profile_entity" DROP COLUMN "noAnswerOnDepressionOrAnxiety"`)
    await queryRunner.query(`ALTER TABLE "user_card_profile_entity" DROP COLUMN "hasDepressionOrAnxiety"`)
    await queryRunner.query(`ALTER TABLE "user_card_profile_entity" DROP COLUMN "overallHealthRating"`)
    await queryRunner.query(`ALTER TABLE "user_card_profile_entity" DROP COLUMN "sleepQualityRating"`)
    await queryRunner.query(`ALTER TABLE "user_card_profile_entity" DROP COLUMN "averageDailySleepHours"`)
    await queryRunner.query(`ALTER TABLE "user_card_profile_entity" DROP COLUMN "averageDailyWaterIntake"`)
    await queryRunner.query(`DROP TABLE "user_lifestyle_survey_entity"`)
    await queryRunner.query(`DROP TABLE "user_journey_survey_entity"`)
  }
}
