import { BaseEntity } from '../base-entities/base.entity'
import { Entity, Column, JoinColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm'
import { StorageEntity } from './storage.entity'
import { VideoTypes } from '../../constants/enums/gallery.constants'
import { ConditionsEntity } from './conditions.entity'
import { MedicationsEntity } from './medications.entity'
import { TriggersEntity } from './triggers.entity'
import { UserVideosEntity } from './user-videos.entity'

@Entity()
export class GalleryVideoEntity extends BaseEntity {
  @Column({
    nullable: false,
  })
  type: VideoTypes

  @ManyToOne(() => StorageEntity, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  video: StorageEntity

  @ManyToOne(() => StorageEntity, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  videoPreview: StorageEntity

  @Column({ nullable: false })
  titleEn: string

  @Column({ nullable: false, default: '' })
  titleSp: string

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
  descriptionEn: string

  @Column({
    type: 'text',
    default: '',
    nullable: false,
  })
  descriptionSp: string

  @Column({ type: 'boolean', default: false })
  isPublished!: boolean

  @ManyToMany(() => ConditionsEntity, (conditions) => conditions.videos)
  @JoinTable({
    name: 'gallery_videos_conditions',
    joinColumn: {
      name: 'galleryVideoId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'conditionId',
      referencedColumnName: 'id',
    },
  })
  conditions: ConditionsEntity[]

  @ManyToMany(() => MedicationsEntity, (medications) => medications.videos)
  @JoinTable({
    name: 'gallery_videos_medications',
    joinColumn: {
      name: 'galleryVideoId',
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
    name: 'gallery_videos_triggers',
    joinColumn: {
      name: 'galleryVideoId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'triggerId',
      referencedColumnName: 'id',
    },
  })
  triggers: TriggersEntity[]

  @OneToMany(() => UserVideosEntity, (userVideos) => userVideos.galleryItem)
  @JoinColumn()
  userVideos: UserVideosEntity[]
}
