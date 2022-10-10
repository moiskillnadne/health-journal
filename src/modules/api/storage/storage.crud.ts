import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StorageEntity } from '../../../database/entities/storage.entity'

@Injectable()
export class StorageCrud {
  constructor(@InjectRepository(StorageEntity) private storageEntityRepository: Repository<StorageEntity>) {}

  getStorageItemByIds(storageItemId: string) {
    return this.storageEntityRepository.findOneBy({ id: storageItemId })
  }

  incrementViewsCount(storageItem: StorageEntity) {
    return this.storageEntityRepository.manager.transaction(async (em) => {
      return await em
        .createQueryBuilder(StorageEntity, 's')
        .select('s.id')
        .setLock('pessimistic_write')
        .where({ id: storageItem.id })
        .getOne()
        .then(async (result) => {
          if (!result) {
            throw new Error('Storage item for updating not found')
          }
          return await em
            .createQueryBuilder(StorageEntity, 's')
            .update(StorageEntity)
            .set({ viewsCount: () => '"viewsCount" + 1' })
            .where('id=:id', { id: result.id })
            .returning(['id', 'viewsCount'])
            .updateEntity(true)
            .execute()
        })
    })
  }
}
