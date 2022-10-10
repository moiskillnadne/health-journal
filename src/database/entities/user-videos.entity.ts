import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'
import { GalleryVideoEntity } from './gallery-video.entity'

import { UserEntity } from './user.entity'

@Entity()
export class UserVideosEntity extends BaseEntity {
  @Column({
    default: false,
    type: 'boolean',
    nullable: false,
  })
  isFavorite: boolean

  @Column({
    default: false,
    type: 'boolean',
    nullable: false,
  })
  isVisited: boolean

  @Column({
    default: false,
    type: 'boolean',
    nullable: false,
  })
  isViewed: boolean

  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string

  @Column({
    type: 'uuid',
    nullable: false,
  })
  galleryItemId: string

  @ManyToOne(() => GalleryVideoEntity, (video) => video.userVideos, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  galleryItem: GalleryVideoEntity

  @OneToMany(() => UserEntity, (user) => user.videos, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity
}
