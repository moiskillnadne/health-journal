import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserCardEntity } from './user-card.entity'

@Entity()
export class UserCardRandomBloodSugarHistoryEntity extends BaseEntity {
  @Column({
    type: 'uuid',
  })
  cardId: string

  @Column({ nullable: true })
  sugarMgDl?: number

  @Column({
    type: 'float',
    nullable: true,
  })
  sugarMmolL?: number

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  datetime?: Date

  @ManyToOne(() => UserCardEntity, (card) => card.randomBloodSugar, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  card: UserCardEntity
}
