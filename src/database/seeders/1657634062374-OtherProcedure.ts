import { MigrationInterface, QueryRunner } from 'typeorm'

import { Procedure } from '../../constants/enums/procedures.constants'
import { ReminderPeriod } from '../../constants/enums/reminders.constants'

export class OtherProcedure1657634062374 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO procedures_entity(id, name, tag, period, interval, order) VALUES
        ('0f379c4b-2b33-4e41-8606-ac6f9f688ea6', 'Other', '${Procedure.Other}', '${ReminderPeriod.Year}', 1, 8);
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE procedures_entity`)
  }
}
