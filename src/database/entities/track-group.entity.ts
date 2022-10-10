import { BaseEntity } from '../base-entities/base.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { TrackEntity } from './track.entity'
import { TrackGroupLineEntity } from './track-group-line.entity'
import { TrackGroupSchedulePeriod } from '../../constants/enums/track.constants'

@Entity()
export class TrackGroupEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    nullable: false,
  })
  trackId: string

  @ManyToOne(() => TrackEntity, (track) => track.groups, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  track: TrackEntity

  @Column()
  order: number

  @Column()
  schedule: TrackGroupSchedulePeriod

  @OneToMany(() => TrackGroupLineEntity, (line) => line.group, { cascade: true })
  lines: TrackGroupLineEntity[]
}
