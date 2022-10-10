import { BaseEntity } from '../base-entities/base.entity'
import { Entity, Column, JoinColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm'
import { StorageEntity } from './storage.entity'
import { ConditionsEntity } from './conditions.entity'
import { MedicationsEntity } from './medications.entity'
import { TriggersEntity } from './triggers.entity'
import { UserArticlesEntity } from './user-articles.entity'

@Entity()
export class GalleryArticleEntity extends BaseEntity {
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

  @ManyToMany(() => ConditionsEntity, (conditions) => conditions.articles)
  @JoinTable({
    name: 'gallery_articles_conditions',
    joinColumn: {
      name: 'galleryArticleId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'conditionId',
      referencedColumnName: 'id',
    },
  })
  conditions: ConditionsEntity[]

  @ManyToMany(() => MedicationsEntity, (medications) => medications.articles)
  @JoinTable({
    name: 'gallery_articles_medications',
    joinColumn: {
      name: 'galleryArticleId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'medicationProductId',
      referencedColumnName: 'productId',
    },
  })
  medications: MedicationsEntity[]

  @ManyToMany(() => TriggersEntity)
  @JoinTable({
    name: 'gallery_articles_triggers',
    joinColumn: {
      name: 'galleryArticleId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'triggerId',
      referencedColumnName: 'id',
    },
  })
  triggers: TriggersEntity[]

  @OneToMany(() => UserArticlesEntity, (userArticles) => userArticles.galleryItem)
  @JoinColumn()
  public userArticles: UserArticlesEntity[]
}
