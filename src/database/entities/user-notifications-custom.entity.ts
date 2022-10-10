import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserEntity } from './user.entity'
import { NotificationCustomEntity } from './notification-custom.entity'
import { StorageEntity } from './storage.entity'
import { GalleryVideoEntity } from './gallery-video.entity'
import { GalleryArticleEntity } from './gallery-article.entity'
import { GalleryRecipeEntity } from './gallery-recipe.entity'

@Entity()
export class UserNotificationsCustomEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string

  @Column({
    type: 'uuid',
    nullable: false,
  })
  notificationId: string

  @Column({
    nullable: true,
  })
  title: string

  @Column({
    type: 'text',
    nullable: true,
  })
  bodyEn: string

  @Column({
    type: 'text',
    nullable: true,
  })
  bodySp: string

  @Column({
    default: false,
    nullable: true,
  })
  isViewed?: boolean

  @ManyToOne(() => StorageEntity, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  image: StorageEntity

  @ManyToOne(() => GalleryVideoEntity, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  video: GalleryVideoEntity

  @ManyToOne(() => GalleryArticleEntity, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  article: GalleryArticleEntity

  @ManyToOne(() => GalleryRecipeEntity, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  recipe: GalleryRecipeEntity

  @ManyToOne(() => UserEntity, (user) => user.notificationsCustom, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity

  @ManyToOne(() => NotificationCustomEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  notification: NotificationCustomEntity
}
