import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUserCognitoId1650371427595 implements MigrationInterface {
  name = 'UpdateUserCognitoId1650371427595'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" RENAME COLUMN "sub" TO "cognitoId"`)
    await queryRunner.query(
      `ALTER TABLE "user_entity" RENAME CONSTRAINT "UQ_9a43efa5912aa6b732b2ea43cf2" TO "UQ_26e2419936b3dd3a902709c5803"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_entity" RENAME CONSTRAINT "UQ_26e2419936b3dd3a902709c5803" TO "UQ_9a43efa5912aa6b732b2ea43cf2"`,
    )
    await queryRunner.query(`ALTER TABLE "user_entity" RENAME COLUMN "cognitoId" TO "sub"`)
  }
}
