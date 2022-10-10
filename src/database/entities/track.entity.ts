import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { TrackGroupEntity } from './track-group.entity'
import { TargetGroupEntity } from './target-group.entity'
import { UserTracksEntity } from './user-tracks.entity'

@Entity()
export class TrackEntity extends BaseEntity {
  @Column({ nullable: false })
  titleEn: string

  @Column({ nullable: false, default: '' })
  titleSp: string

  @Column({ type: 'boolean', default: false })
  isPublished!: boolean

  @ManyToMany(() => TargetGroupEntity, (targetGroups) => targetGroups.tracks)
  @JoinTable({
    name: 'tracks_target_groups',
    joinColumn: {
      name: 'trackId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'targetGroupId',
      referencedColumnName: 'id',
    },
  })
  targetGroups: TargetGroupEntity[]

  @OneToMany(() => TrackGroupEntity, (group) => group.track, { cascade: true })
  groups: TrackGroupEntity[]

  @OneToMany(() => UserTracksEntity, (tracks) => tracks.track)
  @JoinColumn()
  tracks: UserTracksEntity[]
}
