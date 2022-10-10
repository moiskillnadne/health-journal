import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'
import { GalleryVideoEntity } from './gallery-video.entity'
import { GalleryArticleEntity } from './gallery-article.entity'
import { GalleryRecipeEntity } from './gallery-recipe.entity'
import { ProceduresEntity } from './procedures.entity'

import { NotificationKind, NotificationType } from '../../constants/enums/notifications.constants'
import { ReminderPeriod } from '../../constants/enums/reminders.constants'

@Entity()
export class NotificationPredefinedEntity extends BaseEntity {
  @Column({
    nullable: false,
  })
  notification_type!: NotificationKind

  @Column({
    nullable: true,
  })
  type: NotificationType

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

  @Column({
    type: 'enum',
    enum: ReminderPeriod,
    nullable: true,
  })
  remindPeriod?: ReminderPeriod

  @Column({
    nullable: true,
  })
  remindInterval?: number

  @Column({
    type: 'boolean',
    default: false,
  })
  isPublished!: boolean

  @Column({ type: 'boolean', default: false })
  isActive?: boolean

  @ManyToOne(() => GalleryVideoEntity, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  video?: GalleryVideoEntity

  @ManyToOne(() => GalleryArticleEntity, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  article?: GalleryArticleEntity

  @ManyToOne(() => GalleryRecipeEntity, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  recipe?: GalleryRecipeEntity

  @ManyToOne(() => ProceduresEntity, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  procedure?: ProceduresEntity
}
