import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../base-entities/base.entity'
import { IStorageModel } from '../../models/storage.models'
import { StorageContentTypes, StorageFileFormats } from '../../constants/enums/storage.constants'

@Entity()
export class StorageEntity extends BaseEntity implements IStorageModel {
  @Column()
  bucketKey!: string
  @Column()
  bucketName!: string
  @Column()
  contentType!: StorageContentTypes
  @Column()
  fileName!: string
  @Column()
  format!: StorageFileFormats
  @Column()
  location!: string
  @Column({ type: 'int' })
  size!: number
  @Column({ type: 'boolean', default: false })
  isPosted!: boolean
  @Column({ type: 'int', default: 0 })
  viewsCount!: number
  @Column({ type: 'boolean', default: false, select: false })
  isSystem!: boolean
}
