import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm'

import { Period } from '../../constants/enums/period.constants'
import { Currency } from '../../constants/enums/currency.constants'
import { Status } from '../../constants/enums/medications.constants'

import { BaseEntity } from '../base-entities/base.entity'

import { UserEntity } from './user.entity'
import { MedicationsEntity } from './medications.entity'

@Entity()
export class UserMedicationsEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string

  @Column({
    nullable: false,
  })
  medicationProductId: string

  @Column({
    nullable: true,
  })
  frequency?: number

  @Column({
    type: 'enum',
    enum: Period,
    nullable: true,
  })
  period?: Period

  @Column({
    type: 'float',
    nullable: true,
  })
  amount?: number

  @Column({
    type: 'enum',
    enum: Currency,
    nullable: true,
  })
  currency?: Currency

  @Column({
    type: 'enum',
    enum: Status,
    nullable: true,
    default: Status.Active,
  })
  status?: Status

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  statusUpdated?: Date

  @ManyToOne(() => UserEntity, (user) => user.medications, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity

  @ManyToOne(() => MedicationsEntity, (medication) => medication.medications, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'productId' })
  medication: MedicationsEntity
}
