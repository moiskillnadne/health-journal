import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { defaultSettingsNotificationsValue } from '../../constants/enums/settings.constants'
import { BaseEntity } from '../base-entities/base.entity'
import { UserEntity } from './user.entity'

@Entity()
export class UserSettingsNotificationsEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    nullable: false,
  })
  public userId!: string

  @Column({
    type: 'boolean',
    default: defaultSettingsNotificationsValue,
  })
  public pushNotificationsEnable!: boolean

  @Column({
    type: 'boolean',
    default: defaultSettingsNotificationsValue,
  })
  public myWellnessJourneytasksEnable!: boolean

  @Column({
    type: 'boolean',
    default: defaultSettingsNotificationsValue,
  })
  public newsAndUpdatesEnable!: boolean

  @Column({
    type: 'boolean',
    default: defaultSettingsNotificationsValue,
  })
  public medicationRemindersEnable!: boolean

  @Column({
    type: 'boolean',
    default: defaultSettingsNotificationsValue,
  })
  public doctorAppointmentsEnable!: boolean

  @Column({
    type: 'boolean',
    default: defaultSettingsNotificationsValue,
  })
  public screeningTestsEnable!: boolean

  @Column({
    type: 'boolean',
    select: false,
    default: defaultSettingsNotificationsValue,
  })
  public colonScreeningEnable!: boolean

  @Column({
    type: 'boolean',
    select: false,
    default: defaultSettingsNotificationsValue,
  })
  public mammogramEnable!: boolean

  @Column({
    type: 'boolean',
    select: false,
    default: defaultSettingsNotificationsValue,
  })
  public papSmearEnable!: boolean

  @Column({
    type: 'boolean',
    default: defaultSettingsNotificationsValue,
  })
  public eyeExamEnable!: boolean

  @Column({
    type: 'boolean',
    default: defaultSettingsNotificationsValue,
  })
  public scheduleAnAppointmentEnable!: boolean

  @Column({
    type: 'boolean',
    default: defaultSettingsNotificationsValue,
  })
  public vitalsCheckEnable!: boolean

  @Column({
    type: 'boolean',
    default: defaultSettingsNotificationsValue,
  })
  public waterIntakeEnable!: boolean

  @OneToOne(() => UserEntity, (user) => user.settingNotifications, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  public user!: UserEntity
}
