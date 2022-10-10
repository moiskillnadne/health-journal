import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserCardEntity } from './user-card.entity'

@Entity()
export class UserCardBloodPressureHistoryEntity extends BaseEntity {
  @Column({
    type: 'uuid',
  })
  cardId: string

  @Column({ nullable: true })
  pressureSystolicMmHg?: number

  @Column({ nullable: true })
  pressureDiastolicMmHg?: number

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  datetime?: Date

  @ManyToOne(() => UserCardEntity, (card) => card.bloodPressure, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  card: UserCardEntity
}
