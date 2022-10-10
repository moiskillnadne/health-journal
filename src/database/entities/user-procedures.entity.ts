import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserEntity } from './user.entity'
import { UserRemindersEntity } from './user-reminders.entity'
import { ProceduresEntity } from './procedures.entity'

@Entity()
export class UserProceduresEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string

  @Column({
    type: 'uuid',
    nullable: false,
  })
  procedureId: string

  @Column({
    type: 'uuid',
    nullable: true,
  })
  reminderId: string

  @Column({
    nullable: true,
  })
  name: string

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  datetime: Date

  // This column store date without time - this value uses for cron job
  // Value from this column may be different by datetime
  // Datetime store date and time in UTC. (GMT+0)
  // Date based on user timezone
  @Column({
    type: 'date',
    nullable: true,
  })
  date: Date

  @ManyToOne(() => UserEntity, (user) => user.procedures, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity

  @ManyToOne(() => ProceduresEntity, (procedure) => procedure.procedures, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  procedure: ProceduresEntity

  @OneToOne(() => UserRemindersEntity, (reminder) => reminder.procedure, {
    cascade: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  reminder: UserRemindersEntity
}
