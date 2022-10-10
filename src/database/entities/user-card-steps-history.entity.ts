import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserCardEntity } from './user-card.entity'

@Entity()
export class UserCardStepsHistoryEntity extends BaseEntity {
  @Column({
    type: 'uuid',
  })
  cardId: string

  @Column({ nullable: true })
  steps?: number

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  datetime?: Date

  @ManyToOne(() => UserCardEntity, (card) => card.steps, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  card: UserCardEntity
}
