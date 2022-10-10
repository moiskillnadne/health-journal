import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserReminders1654174489368 implements MigrationInterface {
  name = 'UserReminders1654174489368'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_reminders_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "procedureId" uuid NOT NULL, "frequency" character varying, CONSTRAINT "PK_3a2b38b75515263615947d056e2" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" ADD "recurrenceMonths" integer`)
    await queryRunner.query(
      `ALTER TABLE "user_reminders_entity" ADD CONSTRAINT "FK_6f51faaf3bd6973a7c3a4720c7f" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_reminders_entity" ADD CONSTRAINT "FK_611a747f0e42e6cc2e014a2f2aa" FOREIGN KEY ("procedureId") REFERENCES "procedures_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_reminders_entity" DROP CONSTRAINT "FK_611a747f0e42e6cc2e014a2f2aa"`)
    await queryRunner.query(`ALTER TABLE "user_reminders_entity" DROP CONSTRAINT "FK_6f51faaf3bd6973a7c3a4720c7f"`)
    await queryRunner.query(`ALTER TABLE "user_procedures_entity" DROP COLUMN "recurrenceMonths"`)
    await queryRunner.query(`DROP TABLE "user_reminders_entity"`)
  }
}
