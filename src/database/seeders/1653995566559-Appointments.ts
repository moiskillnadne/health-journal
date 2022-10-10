import { MigrationInterface, QueryRunner } from 'typeorm'

export class Appointments1653995566559 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO appointments_entity(name, tag) VALUES
        ('Family Practice or Internal Medicine Appointment', 'family'),
        ('Heart Appointment', 'heart'),
        ('Kidney Appointment', 'kidney'),
        ('Endocrinology Appointment', 'endocrinology'),
        ('Other Appointment', 'other');
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE appointments_entity`)
  }
}
