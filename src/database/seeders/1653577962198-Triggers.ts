import { MigrationInterface, QueryRunner } from 'typeorm'

export class Triggers1653577962198 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO triggers_entity ("shortName", description) VALUES 
      ('No conditions', 'The Patient checks ''None of the above'' option'),
      ('Med video', 'The Patient enters the information about medication'),
      ('Does not check BP', 'The Patient checks ''I do not check my blood pressure.'' option'),
      ('Scheduled doc appt.', 'The Patient checks ''I have it scheduled for...'''),
      ('Doesn''t go to doc', 'The Patient checks ''I don''t go to the doctor.'''),
      ('No colon screening', 'The Patient checks ''I have never had any of these tests done.'''),
      ('No Pap', 'The Patient checks ''I have never had this test done.'),
      ('No mammo', 'The Patient checks ''I have never had this test done.''');
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE triggers_entity`)
  }
}
