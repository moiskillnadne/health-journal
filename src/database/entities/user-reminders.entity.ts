import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm'

import { ReminderType, ReminderPeriod } from '../../constants/enums/reminders.constants'

import { BaseEntity } from '../base-entities/base.entity'

import { UserEntity } from './user.entity'
import { UserProceduresEntity } from './user-procedures.entity'
import { NotificationPredefinedEntity } from './notification-predefined.entity'

@Entity()
export class UserRemindersEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string

  @Column({
    type: 'uuid',
    nullable: false,
  })
  notificationId: string

  @Column({
    type: 'enum',
    enum: ReminderType,
    nullable: false,
    default: ReminderType.Repeat,
  })
  type?: ReminderType

  @Column({
    type: 'enum',
    enum: ReminderPeriod,
    nullable: true,
  })
  period?: ReminderPeriod

  @Column({
    nullable: true,
  })
  interval?: number

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  lastExecuteAt?: Date

  @ManyToOne(() => UserEntity, (user) => user.reminders, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity

  @OneToOne(() => UserProceduresEntity, (procedure) => procedure.reminder, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  procedure: UserProceduresEntity

  @ManyToOne(() => NotificationPredefinedEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  notification: NotificationPredefinedEntity
}
