import { MigrationInterface, QueryRunner } from 'typeorm'

import { Procedure } from '../../constants/enums/procedures.constants'
import { ReminderPeriod } from '../../constants/enums/reminders.constants'

export class PapSmearMammogramProcedures1654262784797 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO procedures_entity(id, name, tag, period, interval, order) VALUES
        ('42817d25-1972-4fd3-bfc9-b33ace470fc6', 'Pap Smear', '${Procedure.PapSmear}', '${ReminderPeriod.Year}', 1, 6),
        ('9d3dfaa3-cc87-4b5d-b8b2-edb0b6ecee8c', 'Mammogram', '${Procedure.Mammogram}', '${ReminderPeriod.Year}', 1, 7);
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE procedures_entity`)
  }
}
