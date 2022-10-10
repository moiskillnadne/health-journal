import { Column, Entity, JoinColumn, OneToOne, OneToMany, ManyToOne } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'
import { ReferralEntity } from './referral.entity'
import { UserCardEntity } from './user-card.entity'
import { UserConditionsEntity } from './user-conditions.entity'
import { GenderEntity } from './gender.entity'
import { RaceEntity } from './race.entity'
import { UserProceduresEntity } from './user-procedures.entity'
import { UserMedicationsEntity } from './user-medications.entity'
import { UserJourneySurveyEntity } from './user-journey-survey.entity'
import { UserLifestyleSurveyEntity } from './user-lifestyle-survey.entity'
import { UserRemindersEntity } from './user-reminders.entity'
import { UserAdditionalInformationEntity } from './additional-information.entity'
import { UserTargetGroupsEntity } from './user-target-groups.entity'
import { UserTracksEntity } from './user-tracks.entity'
import { UserVideosEntity } from './user-videos.entity'
import { UserArticlesEntity } from './user-articles.entity'
import { UserRecipesEntity } from './user-recipes.entity'
import { UserAppointmentsEntity } from './user-appointments.entity'
import { UserDeviceEntity } from './user-dervice.entity'
import { UserNotificationsPredefinedEntity } from './user-notifications-predefined.entity'
import { UserNotificationsCustomEntity } from './user-notifications-custom.entity'
import { UserSettingsNotificationsEntity } from './user-settings-notifications.entity'
import { UserSettingsRemindersEntity } from './user-settings-reminders.entity'

@Entity()
export class UserEntity extends BaseEntity {
  @Column({
    unique: true,
  })
  public email: string

  @Column({
    unique: true,
  })
  public username: string

  @Column({
    unique: true,
    nullable: false,
  })
  public cognitoId: string

  @Column({
    nullable: true,
  })
  public firstName: string

  @Column({
    nullable: true,
  })
  public lastName: string

  @Column({
    nullable: true,
    type: 'date',
  })
  public dateOfBirth: Date

  @Column({ nullable: true })
  public country: string

  @Column({ nullable: true })
  public state: string

  @Column({ nullable: true })
  public city: string

  @Column({ nullable: true })
  public companyCode?: string

  @Column({
    type: 'uuid',
    nullable: true,
  })
  public genderId: string

  @Column({
    type: 'uuid',
    nullable: true,
  })
  public raceId: string

  @Column({
    default: false,
    nullable: true,
  })
  public isQuestionnairePassed: boolean

  @Column({
    default: false,
    nullable: true,
  })
  public isAssessmentPassed: boolean

  @Column({
    nullable: true,
    type: 'timestamp without time zone',
  })
  public lastLoginAt?: Date

  @Column({
    select: false,
    default: 0,
  })
  public loginFailedAttemptsCount?: number

  @Column({
    select: false,
    nullable: true,
    type: 'timestamp without time zone',
  })
  public lastLoginAttemptAt?: Date

  @Column({
    select: false,
    default: false,
  })
  public isEmailConfirmed?: boolean

  @Column({
    select: false,
    nullable: true,
    type: 'timestamp without time zone',
  })
  public emailConfirmedAt?: Date

  @OneToOne(() => ReferralEntity)
  @JoinColumn()
  public referral: ReferralEntity

  @OneToOne(() => UserCardEntity, (healthCard) => healthCard.user)
  public card: UserCardEntity

  @OneToMany(() => UserConditionsEntity, (conditions) => conditions.user)
  @JoinColumn()
  public conditions: UserConditionsEntity[]

  @ManyToOne(() => GenderEntity)
  @JoinColumn()
  public gender: GenderEntity

  @ManyToOne(() => RaceEntity)
  @JoinColumn()
  public race: RaceEntity

  @OneToMany(() => UserAppointmentsEntity, (appointments) => appointments.user)
  @JoinColumn()
  public appointments: UserAppointmentsEntity[]

  @OneToMany(() => UserProceduresEntity, (procedures) => procedures.user)
  @JoinColumn()
  public procedures: UserProceduresEntity[]

  @OneToMany(() => UserMedicationsEntity, (medications) => medications.user)
  @JoinColumn()
  public medications: UserMedicationsEntity[]

  @OneToOne(() => UserJourneySurveyEntity, (survey) => survey.user)
  public journeySurvey: UserJourneySurveyEntity

  @OneToOne(() => UserLifestyleSurveyEntity, (survey) => survey.user)
  public lifestyleSurvey: UserLifestyleSurveyEntity

  @OneToMany(() => UserRemindersEntity, (reminders) => reminders.user)
  @JoinColumn()
  public reminders: UserRemindersEntity[]

  @OneToOne(() => UserAdditionalInformationEntity, (additional) => additional.user)
  public additionalInformation: UserAdditionalInformationEntity

  @OneToMany(() => UserTargetGroupsEntity, (targetGroups) => targetGroups.user)
  @JoinColumn()
  public targetGroups: UserTargetGroupsEntity[]

  @OneToMany(() => UserTracksEntity, (tracks) => tracks.user)
  @JoinColumn()
  public tracks: UserTracksEntity[]

  @OneToMany(() => UserArticlesEntity, (userArticles) => userArticles.user)
  public articles: UserArticlesEntity[]

  @OneToMany(() => UserRecipesEntity, (userRecipes) => userRecipes.user)
  public recipes: UserRecipesEntity[]

  @OneToMany(() => UserVideosEntity, (userVideos) => userVideos.user)
  public videos: UserVideosEntity[]

  @OneToMany(() => UserDeviceEntity, (userDevice) => userDevice.user)
  public device: UserDeviceEntity

  @OneToMany(() => UserNotificationsPredefinedEntity, (notifications) => notifications.user)
  public notificationsPredefined: UserNotificationsPredefinedEntity[]

  @OneToMany(() => UserNotificationsCustomEntity, (notifications) => notifications.user)
  public notificationsCustom: UserNotificationsCustomEntity[]

  @OneToOne(() => UserSettingsNotificationsEntity, (setting) => setting.user)
  public settingNotifications: UserSettingsNotificationsEntity

  @OneToOne(() => UserSettingsRemindersEntity, (setting) => setting.user)
  public settingReminders: UserSettingsRemindersEntity
}
