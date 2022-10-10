import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserCardEntity } from './user-card.entity'

@Entity()
export class UserCardWaterHistoryEntity extends BaseEntity {
  @Column({
    type: 'uuid',
  })
  cardId: string

  @Column({
    type: 'float',
    nullable: false,
  })
  waterFloz?: number

  @Column({
    type: 'float',
    nullable: false,
  })
  waterMl?: number

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  datetime?: Date

  @ManyToOne(() => UserCardEntity, (card) => card.water, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  card: UserCardEntity
}
