import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserQuestionnaireAndAssessmentFlagsAdded1654684330902 implements MigrationInterface {
  name = 'UserQuestionnaireAndAssessmentFlagsAdded1654684330902'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "isQuestionnairePassed" boolean DEFAULT false`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "isAssessmentPassed" boolean DEFAULT false`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "isAssessmentPassed"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "isQuestionnairePassed"`)
  }
}
