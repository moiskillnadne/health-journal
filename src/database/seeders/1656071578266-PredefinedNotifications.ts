import { MigrationInterface, QueryRunner } from 'typeorm'

import { NotificationKind, NotificationType } from '../../constants/enums/notifications.constants'
import { ReminderPeriod } from '../../constants/enums/reminders.constants'

export class PredefinedNotifications1656071578266 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO notification_predefined_entity("isActive", notification_type, type, name, "contentEn", "contentSp", "remindPeriod", "remindInterval", "procedureId") VALUES
        (true, '${NotificationKind.PushNotification}', '${NotificationType.DoctorAppointmentInTwoWeeks}', 'You have an appointment in 2 weeks', 'You have a doctor''s appointment in two weeks. Please watch the video on how to best prepare for your upcoming appointment.', '', null, null, null),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.DoctorAppointmentInOneWeek}', 'You have an appointment in 1 week', 'You have a doctor''s appointment in one week, don’t forget! Click below if you need to update the appointment date.', '', null, null, null),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.DoctorAppointmentInOneDay}', 'You have an appointment in 1 day', 'You deserve to take care of yourself! Don’t forget your doctor''s appointment is tomorrow! Make sure to print out your VitalOp Wellness personal health record to make sure you get the most out of your visit.', '', null, null, null),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.DoctorAppointmentOneDayAgo}', 'You have visited your doctor 1 day ago', 'Way to put yourself first! Hopefully you had a great visit with your doctor.   When is your next doctor''s appointment scheduled?', '', '${ReminderPeriod.Week}', 4, null),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.DoctorAppointmentThreeDaysAgo}', 'You have visited your doctor 3 days ago', 'Do not forget- You are in control of your health information! Please update your new labs and medications to help you stay on track.', '', null, null, null),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.DoctorAppointmentToSchedule}', 'Blank Doctor Visit Date', 'Time flies! We know life can be busy so this is a helpful reminder to schedule yourself a doctor visit. Call today and add it to your Health Record. You are in control.', '', '${ReminderPeriod.Week}', 4, null),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.DiabeticEyeExamToExpire}', 'Eye Exam about to Expire', 'It''s not what you look at that matters, it''s what you see.- Henry David Thoreau It is time for your repeat eye exam! Don''t let this slip by. Get your eyes checked! You only have one pair ya know! Please input the date below so we can help you stay on track!', '', '${ReminderPeriod.Week}', 4, '8f23bd60-82b3-4b2b-81f1-334f8e46b35c'),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.DiabeticEyeExamToSchedule}', 'Eye Exam Blank', 'Diabetes is one of the leading causes of blindness. Don''t let this slip by. Get your eyes checked! Please input the date below of your next eye exam so we can help you stay on track.', '', '${ReminderPeriod.Week}', 4, '8f23bd60-82b3-4b2b-81f1-334f8e46b35c'),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.DiabeticEyeExamInTwoWeeks}', 'Diabetic Eye Exam in 2 weeks', 'Good Job taking care of your Eyes! You have an eye exam in 2 weeks. Click below if you need to update the eye exam date.', '', null, null, null),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.DiabeticEyeExamInTwoDays}', 'Diabetic Eye Exam in 2 days', 'Don’t forget your eye exam is in 2 days! Please have them send a copy of the report to your doctor to keep on your chart.', '', null, null, null),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.DiabeticEyeExamOneDayAgo}', 'One Day After your Eye Exam', 'Your eyes will thank you! We hope your eye exam went well. When is your next Diabetic Eye Exam scheduled?', '', null, null, '8f23bd60-82b3-4b2b-81f1-334f8e46b35c'),
        (false, '${NotificationKind.PushNotification}', '${NotificationType.Inactivity}', 'Inactivity Reminder', 'It''s Time to take Action to a Healthier You! STARVE your distractions and FEED your focus.  Its starts with YOU!  Let''s continue your health track! ', '', null, null, null),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.TrackTasksAssigned}', 'Daily Task', 'Don''t miss today''s health tip! Use the knowledge you gain to take action! You got this!', '', null, null, null),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.TrackTasksUpdated}', 'Track Updates', 'There are updates in your Wellness Track!', '', null, null, null),
        (false, '${NotificationKind.InAppNotification}', '${NotificationType.BloodPressureGoal}', 'Blood Pressure Goal', 'Amazing Job! Your arteries will thank you. Meeting your blood pressure goal helps lower your risk of many heart and kidney related diseases. Keep up the good work! Use what you learn from VitalOp and work with your doctor to help you stay on track. ', '', null, null, null),
        (false, '${NotificationKind.InAppNotification}', '${NotificationType.Hba1cGoal}', 'HbA1c Goal', '', '', null, null, null),
        (false, '${NotificationKind.InAppNotification}', '${NotificationType.BloodSugarFastingGoal}', 'Blood Sugar Fasting Goal', 'Whoooo hoooo! Reaching your fasting blood sugar goal helps you be in control of your health! VitalOp is here to continue to help. Don''t forget to work with your doctor to continue to control your sugars in a safe way.', '', null, null, null),
        (false, '${NotificationKind.InAppNotification}', '${NotificationType.RandomBloodSugarGoal}', 'Random Blood Sugar Goal', 'You rock. You have met your random blood sugar goal. Continue choosing foods that work with your body and help you stay on track! VitalOp is here to continue to help. Don''t forget to work with your doctor to continue to control your sugars in a safe way. ', '', null, null, null),
        (false, '${NotificationKind.InAppNotification}', '${NotificationType.BloodSugarAfterMealGoal}', 'Blood Sugar After Meal Goal', 'You are in control of your body! Way to go. You have met your post meal blood sugar goal. VitalOp is here to continue to help. Don''t  forget to work with your doctor to continue to control your sugars in a safe way. ', '', null, null, null),
        (false, '${NotificationKind.InAppNotification}', '${NotificationType.LdlGoal}', 'LDL Goal', 'You rock, improving your health one goal at a time. You have met your LDL goal. ', '', null, null, null),
        (false, '${NotificationKind.InAppNotification}', '${NotificationType.WeightGoal}', 'Weight Goal', 'You rock!  It''s not just the weight you lose, but the life you gain.', '', null, null, null),
        (false, '${NotificationKind.PushNotification}', '${NotificationType.MedicationOffGoal}', 'Off a Medication', 'You have reduced your medications! You should be proud. Don''t forget, always work with your doctor to do this in a safe way. You got this!', '', null, null, null),
        (false, '${NotificationKind.PushNotification}', '${NotificationType.WaterIntakeGoal}', 'Water Intake Goal', 'Awesome!  You met your water intake goal for the day!', '', null, null, null),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.ColonScreeningToExpire}', 'Colon Screening ABOUT to EXPIRE', 'Colon Cancer is much easier to treat when found and removed early!! It is time again for your colon cancer screening. If you have not already done so, contact your doctor to get your repeat test set up! Remember even if you do not have insurance, the basic screening tests can be found at a reasonable cash price! ASK the DOC!!', '', '${ReminderPeriod.Week}', 8, '922b86c0-c0ef-45b7-a3b6-edb12c00530c'),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.ColonScreeningToSchedule}', 'Colon Screening Blank', 'Colon Cancer is much easier to treat when found and removed early!! If you have not already done so contact your doctor to get your test set up! Remember even if you do not have insurance, the basic screening tests can be found at a reasonable cash price! ASK the DOC!!', '', '${ReminderPeriod.Week}', 8, '922b86c0-c0ef-45b7-a3b6-edb12c00530c'),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.MammogramToExpire}', 'Mammogram Reminder', 'It''s time to save the Ta Tas again!  It has been 11 months since your last mammogram.  Call to schedule and add to your VitalOP health record. You be in control of your health information! ** Ask your doctor about cash pricing even if you are without insurance. ', '', '${ReminderPeriod.Week}', 8, '9d3dfaa3-cc87-4b5d-b8b2-edb0b6ecee8c'),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.MammogramToSchedule}', 'Mammogram Blank', 'Screening for Breast Cancer starts with a mammogram! Even if you already had it, put in the date so you can keep up with your health information. VitalOp will help you stay on track too, once you enter your date!', '', '${ReminderPeriod.Week}', 8, '9d3dfaa3-cc87-4b5d-b8b2-edb0b6ecee8c'),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.PapSmearToExpire}', 'Pap Smear Reminder', 'Alright Alright, It''s that time! Call your doctor and schedule your Pap smear or update your information in your VitalOp Health Record if you have had it done. ', '', '${ReminderPeriod.Week}', 8, '42817d25-1972-4fd3-bfc9-b33ace470fc6'),
        (true, '${NotificationKind.PushNotification}', '${NotificationType.PapSmearToSchedule}', 'Pap Smear Blank', 'Cervical Cancer Screening starts with a Pap Smear. Do not delay this important test. ', '', '${ReminderPeriod.Week}', 8, '42817d25-1972-4fd3-bfc9-b33ace470fc6');
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE notification_predefined_entity`)
  }
}