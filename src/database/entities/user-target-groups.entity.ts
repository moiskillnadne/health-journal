import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserEntity } from './user.entity'
import { TargetGroupEntity } from './target-group.entity'

@Entity()
export class UserTargetGroupsEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string

  @Column({
    type: 'uuid',
    nullable: false,
  })
  targetGroupId: string

  @ManyToOne(() => UserEntity, (user) => user.targetGroups, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity

  @ManyToOne(() => TargetGroupEntity, (targetGroups) => targetGroups.targetGroups, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  targetGroup: TargetGroupEntity
}
