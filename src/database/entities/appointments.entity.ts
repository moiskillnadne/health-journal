import { Column, Entity, OneToMany, JoinColumn } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserAppointmentsEntity } from './user-appointments.entity'

@Entity()
export class AppointmentsEntity extends BaseEntity {
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
  tag?: string

  @OneToMany(() => UserAppointmentsEntity, (appointments) => appointments.appointment)
  @JoinColumn()
  appointments: UserAppointmentsEntity[]
}
