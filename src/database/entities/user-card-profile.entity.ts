import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserCardEntity } from './user-card.entity'

@Entity()
export class UserCardProfileEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    unique: true,
  })
  cardId: string

  @Column({
    default: false,
    nullable: true,
  })
  noDiabeticEyeExam?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  noBloodPressureCheck?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  needToScheduleAppointment?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  noScheduledAppointment?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  noColonScreening?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  noNeedColonScreening?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  noPapSmear?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  noNeedPapSmear?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  noMammogram?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  noNeedMammogram?: boolean

  @Column({ nullable: true })
  averageDailyWaterIntake?: number

  @Column({
    type: 'float',
    nullable: true,
  })
  averageDailySleepHours?: number

  @Column({ nullable: true })
  sleepQualityRating?: number

  @Column({ nullable: true })
  overallHealthRating?: number

  @Column({
    default: false,
    nullable: true,
  })
  hasDepressionOrAnxiety?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  noAnswerOnDepressionOrAnxiety?: boolean

  @OneToOne(() => UserCardEntity, (card) => card.profile, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  card: UserCardEntity
}
