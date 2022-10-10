import { Column, Entity, Index, OneToMany, JoinColumn, ManyToMany } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserMedicationsEntity } from './user-medications.entity'
import { GalleryVideoEntity } from './gallery-video.entity'
import { GalleryArticleEntity } from './gallery-article.entity'

@Entity()
export class MedicationsEntity extends BaseEntity {
  @Column({
    unique: true,
    nullable: false,
  })
  productId: string

  @Index()
  @Column({
    nullable: false,
  })
  name: string

  @Column({
    type: 'float',
    array: true,
    nullable: true,
  })
  dose?: number[]

  @Column({
    nullable: true,
  })
  units?: string

  @OneToMany(() => UserMedicationsEntity, (medications) => medications.medication)
  @JoinColumn()
  medications: UserMedicationsEntity[]

  @ManyToMany(() => GalleryVideoEntity, (videos) => videos.medications)
  videos: GalleryVideoEntity[]

  @ManyToMany(() => GalleryArticleEntity, (articles) => articles.medications)
  articles: GalleryArticleEntity[]
}
