import { MigrationInterface, QueryRunner } from 'typeorm'

export class Gender1652803549353 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO gender_entity(name) VALUES
        ('Male'),
        ('Female');
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE gender_entity`)
  }
}
