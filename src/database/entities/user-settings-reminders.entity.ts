import { Column, Entity, OneToOne, JoinColumn } from 'typeorm'

import { ReminderTimePeriod } from '../../constants/enums/reminders.constants'

import { BaseEntity } from '../base-entities/base.entity'

import { UserEntity } from './user.entity'

@Entity()
export class UserSettingsRemindersEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    unique: true,
    nullable: false,
  })
  userId: string

  @Column({
    type: 'enum',
    enum: ReminderTimePeriod,
    nullable: true,
  })
  waterPeriod?: ReminderTimePeriod

  @Column({
    nullable: true,
  })
  waterInterval?: number

  @Column({
    type: 'time',
    nullable: true,
  })
  waterFrom?: string

  @Column({
    type: 'time',
    nullable: true,
  })
  waterTo?: string

  @OneToOne(() => UserEntity, (user) => user.settingReminders, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity
}
