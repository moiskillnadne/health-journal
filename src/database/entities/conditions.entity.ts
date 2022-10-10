import { Column, Entity, OneToMany, JoinColumn, ManyToMany } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserConditionsEntity } from './user-conditions.entity'
import { GalleryVideoEntity } from './gallery-video.entity'
import { GalleryArticleEntity } from './gallery-article.entity'

@Entity()
export class ConditionsEntity extends BaseEntity {
  @Column({
    nullable: false,
  })
  name: string

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string

  @Column({
    nullable: true,
  })
  tag?: string

  @Column({
    nullable: false,
    type: 'numeric',
    default: 0,
  })
  order: number

  @OneToMany(() => UserConditionsEntity, (conditions) => conditions.condition)
  @JoinColumn()
  conditions: UserConditionsEntity[]

  @ManyToMany(() => GalleryVideoEntity, (videos) => videos.conditions)
  videos: GalleryVideoEntity[]

  @ManyToMany(() => GalleryArticleEntity, (articles) => articles.conditions)
  articles: GalleryArticleEntity[]
}
