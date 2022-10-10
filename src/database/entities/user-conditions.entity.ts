import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserEntity } from './user.entity'
import { ConditionsEntity } from './conditions.entity'
import { ConditionStatus } from '../../constants/enums/condition.constants'

@Entity()
export class UserConditionsEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string

  @Column({
    type: 'uuid',
    nullable: false,
  })
  conditionId: string

  @Column({
    nullable: true,
  })
  info: string

  @Column({
    type: 'enum',
    enum: ConditionStatus,
    nullable: false,
    default: ConditionStatus.Current,
  })
  status?: ConditionStatus

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  conditionResolvedDate?: Date | null

  @ManyToOne(() => UserEntity, (user) => user.conditions, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity

  @ManyToOne(() => ConditionsEntity, (conditions) => conditions.conditions, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  condition: ConditionsEntity
}
