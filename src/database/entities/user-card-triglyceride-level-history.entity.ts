import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserCardEntity } from './user-card.entity'

@Entity()
export class UserCardTriglycerideLevelHistoryEntity extends BaseEntity {
  @Column({
    type: 'uuid',
  })
  cardId: string

  @Column({ nullable: true })
  triglycerideMgDl?: number

  @Column({
    type: 'float',
    nullable: true,
  })
  triglycerideMmolL?: number

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  datetime?: Date

  @ManyToOne(() => UserCardEntity, (card) => card.triglyceride, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  card: UserCardEntity
}
