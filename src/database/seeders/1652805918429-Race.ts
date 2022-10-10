import { MigrationInterface, QueryRunner } from 'typeorm'

export class Race1652805918429 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO race_entity(name) VALUES
        ('Hispanic/Latino'),
        ('American Indian/Alaska Native'),
        ('Asian'),
        ('Black/African American'),
        ('Native Hawaiian/Other Pacific Islander'),
        ('White/Caucasian or European'),
        ('Other');
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE race_entity`)
  }
}
