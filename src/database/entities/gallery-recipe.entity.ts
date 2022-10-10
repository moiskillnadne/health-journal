import { BaseEntity } from '../base-entities/base.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { StorageEntity } from './storage.entity'
import { UserRecipesEntity } from './user-recipes.entity'

@Entity()
export class GalleryRecipeEntity extends BaseEntity {
  @ManyToOne(() => StorageEntity, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  image: StorageEntity

  @Column({ nullable: false })
  titleEn: string

  @Column({ nullable: false, default: '' })
  titleSp: string

  @Column({ nullable: false })
  summaryEn: string

  @Column({ nullable: false, default: '' })
  summarySp: string

  @Column('varchar', {
    array: true,
    default: [],
    nullable: false,
  })
  public keywordsEn!: string[]

  @Column('varchar', {
    array: true,
    default: [],
    nullable: false,
  })
  keywordsSp!: string[]

  @Column({
    type: 'text',
    default: '',
    nullable: false,
  })
  textEn: string

  @Column({
    type: 'text',
    default: '',
    nullable: false,
  })
  textSp: string

  @Column({ type: 'boolean', default: false })
  isPublished!: boolean

  @OneToMany(() => UserRecipesEntity, (userRecipe) => userRecipe.galleryItem)
  @JoinColumn()
  public userRecipes: UserRecipesEntity[]
}
