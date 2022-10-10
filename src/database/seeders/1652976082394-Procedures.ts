import { MigrationInterface, QueryRunner } from 'typeorm'

import { Procedure } from '../../constants/enums/procedures.constants'
import { ReminderPeriod } from '../../constants/enums/reminders.constants'

export class Procedures1652976082394 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO procedures_entity(id, name, tag, period, interval, order) VALUES
        ('8f23bd60-82b3-4b2b-81f1-334f8e46b35c', 'Diabetic Eye Exam', '${Procedure.DiabeticEyeExam}', '${ReminderPeriod.Year}', 1, 1);
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE procedures_entity`)
  }
}
