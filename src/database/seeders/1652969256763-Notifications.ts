import { MigrationInterface, QueryRunner } from 'typeorm'

export class Notifications1652969256763 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO notification_entity(name, description, tag) VALUES
        ('Push Notifications', 'These notifications are vital in your journey to better heath.', 'pushNotificationsEnable'),
        ('My Wellness Journey tasks', 'Make sure you stay connected to your Wellness Journey. This is vital to reverse and prevent chronic disease.', 'myWellnessJourneytasksEnable'),
        ('News and Updates', 'Stay connected with VItalOP and the most up to date health information. You do not want to miss out!', 'newsAndUpdatesEnable'),
        ('Medication Reminders', 'Use this reminder to help you remember to take your medications', 'medicationRemindersEnable'),
        ('Doctor Appointments', 'Use this reminder to help you remember to take your medications', 'doctorAppointmentsEnable'),
        ('Screening Tests', 'Use this reminder to help you remember your upcoming procedures.', 'screeningTestsEnable'),
        ('Eye Exam', 'Use this reminder to help you remember your upcoming eye exam.', 'eyeExamEnable'),
        ('Schedule an Appointment', 'Use this reminder to help you remember your upcoming appointments.', 'scheduleAnAppointmentEnable'),
        ('Vitals Check', 'Use this reminder to help you remember to check your blood pressure or blood sugars regularly.', 'vitalsCheckEnable'),
        ('Water Intake', 'Use this reminder to help you remember to drink water on a regular basis.', 'waterIntakeEnable');
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE notification_entity`)
  }
}
