import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserEntity } from './user.entity'
import { GalleryRecipeEntity } from './gallery-recipe.entity'

@Entity()
export class UserRecipesEntity extends BaseEntity {
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

  @ManyToOne(() => GalleryRecipeEntity, (recipe) => recipe.userRecipes, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  galleryItem: GalleryRecipeEntity

  @OneToMany(() => UserEntity, (user) => user.recipes, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity
}
