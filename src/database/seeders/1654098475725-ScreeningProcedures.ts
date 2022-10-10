import { MigrationInterface, QueryRunner } from 'typeorm'

import { Procedure } from '../../constants/enums/procedures.constants'
import { ReminderPeriod } from '../../constants/enums/reminders.constants'

export class ScreeningProcedures1654098475725 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO procedures_entity(id, name, tag, period, interval, order) VALUES
        ('662872da-aff9-4798-926d-8a99331eda58', 'Blood Stool Testing', '${Procedure.BloodStoolTesting}', '${ReminderPeriod.Year}', 1, 2),
        ('ef533c4b-2063-4c5b-bce5-afcb4e113b97', 'Cologuard', '${Procedure.Cologuard}', '${ReminderPeriod.Year}', 3, 3),
        ('922b86c0-c0ef-45b7-a3b6-edb12c00530c', 'Colonoscopy', '${Procedure.Colonoscopy}', '${ReminderPeriod.Year}', 5, 4),
        ('ab1bf3f9-8341-4bc6-8523-c51f74f9a9ac', 'CT Colonography', '${Procedure.Colonography}', '${ReminderPeriod.Year}', 5, 5);
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE procedures_entity`)
  }
}
