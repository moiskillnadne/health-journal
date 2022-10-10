import { MigrationInterface, QueryRunner } from 'typeorm'

import { TargetGroup } from '../../constants/enums/target-group.constants'

export class TargetGroups1654697477617 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO target_group_entity(title, tag) VALUES
        ('All users with BMI 25 or greater or that check overweight/obese', '${TargetGroup.BmiMore25}'),
        ('Diabetes Type 2', '${TargetGroup.DiabetesType2}'),
        ('Diabetes Type 1', '${TargetGroup.DiabetesType1}'),
        ('Pre-Diabetes', '${TargetGroup.PreDiabetes}'),
        ('Insulin Resistance', '${TargetGroup.InsulinResistance}'),
        ('Polycystic Ovarian Syndrome', '${TargetGroup.PolycysticOvarianSyndrome}'),
        ('High Blood Pressure', '${TargetGroup.HighBloodPressure}'),
        ('Heart Disease', '${TargetGroup.HeartDisease}'),
        ('High Cholesterol or Triglycerides', '${TargetGroup.HighCholesterolTriglycerides}'),
        ('Overweight or Obese', '${TargetGroup.OverweightOrObese}'),
        ('Sleep Apnea', '${TargetGroup.SleepApnea}'),
        ('Acid Reflux, Heartburn, or GERD', '${TargetGroup.AcidRefluxHeartburn}'),
        ('Fatty Liver Disease', '${TargetGroup.FattyLiverDisease}'),
        ('Arthritis or Joint Pain', '${TargetGroup.ArthritisJointPain}'),
        ('None of the above', '${TargetGroup.None}'),
        ('All users', '${TargetGroup.All}'),
        ('Those that answer yes to anxiety/depression question', '${TargetGroup.AnxietyDepression}'),
        ('Females 45 and older', '${TargetGroup.FemalesMore45}'),
        ('Females younger than 45', '${TargetGroup.FemalesBelow45}'),
        ('Females', '${TargetGroup.Females}'),
        ('Males 45 and older', '${TargetGroup.MalesMore45}'),
        ('Males younger than 45', '${TargetGroup.MalesBelow45}'),
        ('Males', '${TargetGroup.Males}');
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE target_group_entity`)
  }
}
