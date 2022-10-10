import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserEntity } from './user.entity'
import { UserAppointmentsEntity } from './user-appointments.entity'
import { UserProceduresEntity } from './user-procedures.entity'
import { NotificationPredefinedEntity } from './notification-predefined.entity'

@Entity()
export class UserNotificationsPredefinedEntity extends BaseEntity {
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
    nullable: true,
  })
  title: string

  @Column({
    type: 'text',
    nullable: true,
  })
  bodyEn: string

  @Column({
    type: 'text',
    nullable: true,
  })
  bodySp: string

  @Column({
    default: false,
    nullable: true,
  })
  isViewed?: boolean

  @ManyToOne(() => UserEntity, (user) => user.notificationsPredefined, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity

  @ManyToOne(() => NotificationPredefinedEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  notification: NotificationPredefinedEntity

  @ManyToOne(() => UserAppointmentsEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  appointment?: UserAppointmentsEntity

  @ManyToOne(() => UserProceduresEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  procedure?: UserProceduresEntity
}
