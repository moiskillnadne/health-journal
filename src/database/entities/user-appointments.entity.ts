import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserEntity } from './user.entity'
import { AppointmentsEntity } from './appointments.entity'

@Entity()
export class UserAppointmentsEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string

  @Column({
    type: 'uuid',
    nullable: false,
  })
  appointmentId: string

  @Column({
    nullable: true,
  })
  speciality?: string

  @Column({
    nullable: true,
  })
  doctor?: string

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
  })
  datetime: Date

  @ManyToOne(() => UserEntity, (user) => user.appointments, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity

  @ManyToOne(() => AppointmentsEntity, (appointment) => appointment.appointments)
  @JoinColumn()
  appointment: AppointmentsEntity
}
