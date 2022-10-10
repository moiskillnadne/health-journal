import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { StorageFoodContentTypes, StorageFoodFileFormats } from '../../constants/enums/storage.constants'
import { StorageEntity } from './storage.entity'

@Entity()
export class FoodEntity extends BaseEntity {
  @Column()
  public title!: string

  @Column()
  public bucketKey!: string

  @Column()
  public bucketName!: string

  @Column()
  public contentType!: StorageFoodContentTypes

  @Column()
  public fileName!: string

  @Column()
  public format!: StorageFoodFileFormats

  @Column()
  public location!: string

  @Column({ type: 'int' })
  public size!: number

  @ManyToOne(() => StorageEntity)
  @JoinColumn()
  public videoPreview!: StorageEntity
}
