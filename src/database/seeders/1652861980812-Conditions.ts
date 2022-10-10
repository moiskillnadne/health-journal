import { MigrationInterface, QueryRunner } from 'typeorm'

import { Condition } from '../../constants/enums/condition.constants'

export class Conditions1652861980812 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO conditions_entity(name, description, tag, "order") VALUES
        ('Diabetes Type 2', 'Diabetes Type 2 is mainly lifestyle related and develops over time. This is a condition diagnosed by a healthcare professional when your body does not properly use sugar as fuel, leading to high levels in your blood.', '${Condition.DiabetesType2}', 1),
        ('Diabetes Type 1', 'Diabetes Type 1 is a condition where your pancreas does not make insulin or makes very little. This condition is typically treated with insulin only and is diagnosed by a healthcare professional.', '${Condition.DiabetesType1}', 2),
        ('Pre-Diabetes', 'Prediabetes is mainly lifestyle related and develops over time. This is a condition diagnosed by a healthcare professional when your body does not properly use sugar as fuel, leading to high levels in your blood. Blood sugar levels at this stage are not high enough to be considered diabetes, but this is the stage immediately before Diabetes Type 2 is diagnosed.', '${Condition.PreDiabetes}', 3),
        ('Insulin Resistance', 'Insulin Resistance is a condition where your cells do not respond well to the insulin your body is making, decreasing your ability to take up sugar from your blood. This condition, if ignored, can eventually lead to prediabetes and diabetes.', '${Condition.InsulinResistance}', 4),
        ('Polycystic Ovarian Syndrome', 'Polycystic Ovarian Syndrome is a hormonal condition affecting women that can cause weight gain and irregular periods. It is diagnosed by a healthcare professional. This condition can be associated with insulin resistance.', '${Condition.PolycysticOvarianSyndrome}', 5),
        ('High Blood Pressure', null, '${Condition.HighBloodPressure}', 6),
        ('Heart Disease', 'Heart Disease includes any condition that affects your heart or the blood vessels in your heart. Examples of events that would put someone in this category include - heart attack, stroke, having a heart stent, having heart bypass surgery, having blocked arteries of the heart.', '${Condition.HeartDisease}', 7),
        ('High Cholesterol or Triglycerides', null, '${Condition.HighCholesterolTriglycerides}', 8),
        ('Overweight or Obese', null, '${Condition.OverweightOrObese}', 9),
        ('Sleep Apnea', null, '${Condition.SleepApnea}', 10),
        ('Acid Reflux, Heartburn, or GERD', null, '${Condition.AcidRefluxHeartburn}', 11),
        ('Fatty Liver Disease', 'Fatty Liver Disease is a condition where your body stores excess sugar in the liver as fat and is diagnosed by a healthcare professional.', '${Condition.FattyLiverDisease}', 12),
        ('Arthritis or Joint Pain', null, '${Condition.ArthritisJointPain}', 13);
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE conditions_entity`)
  }
}
