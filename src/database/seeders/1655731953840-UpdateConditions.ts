import { MigrationInterface, QueryRunner } from 'typeorm'

import { Condition } from '../../constants/enums/condition.constants'

export class UpdateConditions1655731953840 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO conditions_entity(name, description, tag, "order") VALUES
        ('None of the above', null, '${Condition.None}', 14),
        ('Other', null, '${Condition.Other}', 15);
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE conditions_entity`)
  }
}
