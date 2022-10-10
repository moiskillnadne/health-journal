import { GalleryArticleEntity } from './gallery-article.entity'
import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserEntity } from './user.entity'

@Entity()
export class UserArticlesEntity extends BaseEntity {
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
    type: 'uuid',
    nullable: false,
  })
  userId: string

  @Column({
    type: 'uuid',
    nullable: false,
  })
  galleryItemId: string

  @ManyToOne(() => GalleryArticleEntity, (article) => article.userArticles, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  galleryItem: GalleryArticleEntity

  @OneToMany(() => UserEntity, (user) => user.articles, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity
}
