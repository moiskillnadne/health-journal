import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm'
import { BaseEntity } from '../base-entities/base.entity'
import { StorageEntity } from './storage.entity'
import { GalleryVideoEntity } from './gallery-video.entity'
import { GalleryArticleEntity } from './gallery-article.entity'
import { GalleryRecipeEntity } from './gallery-recipe.entity'
import { TargetGroupEntity } from './target-group.entity'
import { CustomNotificationSendingStrategy, NotificationKind } from '../../constants/enums/notifications.constants'

@Entity()
export class NotificationCustomEntity extends BaseEntity {
  @Column({ default: NotificationKind.PushNotification, nullable: false })
  notification_type!: NotificationKind

  @Column()
  name: string

  @Column({
    type: 'text',
    default: '',
    nullable: false,
  })
  contentEn: string

  @Column({
    type: 'text',
    default: '',
    nullable: false,
  })
  contentSp: string

  @ManyToOne(() => StorageEntity, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  image: StorageEntity

  @Column()
  sending_strategy: CustomNotificationSendingStrategy

  @Column({
    nullable: false,
    default: (): string => 'CURRENT_TIMESTAMP',
    type: 'timestamp without time zone',
  })
  public sending_date: Date

  @ManyToOne(() => GalleryVideoEntity, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  video?: GalleryVideoEntity

  @ManyToOne(() => GalleryArticleEntity, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  article?: GalleryArticleEntity

  @ManyToOne(() => GalleryRecipeEntity, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  recipe?: GalleryRecipeEntity

  @ManyToMany(() => TargetGroupEntity)
  @JoinTable({
    name: 'notifications_custom_target_groups',
    joinColumn: {
      name: 'notificationId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'targetGroupId',
      referencedColumnName: 'id',
    },
  })
  targetGroups: TargetGroupEntity[]
}
