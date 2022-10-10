import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { GalleryRecipeEntity } from './gallery-recipe.entity'
import { GalleryArticleEntity } from './gallery-article.entity'
import { GalleryVideoEntity } from './gallery-video.entity'
import { TrackGroupEntity } from './track-group.entity'

@Entity()
export class TrackGroupLineEntity extends BaseEntity {
  @ManyToOne(() => TrackGroupEntity, (group) => group.lines, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  group: TrackGroupEntity

  @ManyToOne(() => GalleryVideoEntity, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  video?: GalleryVideoEntity

  @ManyToOne(() => GalleryArticleEntity, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  article?: GalleryArticleEntity

  @ManyToOne(() => GalleryRecipeEntity, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  recipe?: GalleryRecipeEntity

  @Column()
  order: number
}
