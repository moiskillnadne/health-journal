import { Column, Entity, OneToMany, JoinColumn } from 'typeorm'

import { Procedure } from '../../constants/enums/procedures.constants'
import { ReminderPeriod } from '../../constants/enums/reminders.constants'

import { BaseEntity } from '../base-entities/base.entity'

import { UserProceduresEntity } from './user-procedures.entity'

@Entity()
export class ProceduresEntity extends BaseEntity {
  @Column({
    nullable: true,
  })
  order: number

  @Column({
    nullable: false,
  })
  name: string

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string

  @Column({
    nullable: true,
  })
  tag?: Procedure

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

  @OneToMany(() => UserProceduresEntity, (procedures) => procedures.procedure)
  @JoinColumn()
  procedures: UserProceduresEntity[]
}
