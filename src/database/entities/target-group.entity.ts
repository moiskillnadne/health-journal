import { BaseEntity } from '../base-entities/base.entity'
import { Column, Entity, JoinColumn, ManyToMany, OneToMany } from 'typeorm'

import { UserTargetGroupsEntity } from './user-target-groups.entity'
import { TrackEntity } from './track.entity'

@Entity()
export class TargetGroupEntity extends BaseEntity {
  @Column({
    nullable: false,
  })
  title: string

  @Column({
    nullable: true,
  })
  tag?: string

  @OneToMany(() => UserTargetGroupsEntity, (targetGroups) => targetGroups.targetGroup)
  @JoinColumn()
  targetGroups: UserTargetGroupsEntity[]

  @ManyToMany(() => TrackEntity, (tracks) => tracks.targetGroups)
  tracks: TrackEntity[]
}
