import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, In, Repository } from 'typeorm'
import { StorageEntity } from '../../../../database/entities/storage.entity'
import { IStorageModel, IStorageResponse } from '../../../../models/storage.models'
import { StorageContentTypes } from '../../../../constants/enums/storage.constants'
import { StorageListingOptionsDTO } from './storage.dto'
import { PaginationOptionsDTO } from '../../../../core/dtos/pagination'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

@Injectable()
export class StorageEntityService {
  constructor(
    @InjectRepository(StorageEntity)
    protected storageRepository: Repository<StorageEntity>,
  ) {}

  saveStorageItems(files: IStorageModel[]): Promise<IStorageResponse[]> {
    return this.storageRepository.save(files)
  }

  async getExistingFilesByNamesAndExts(
    originalFilesNames: { fileName: string; fileExt: string }[],
    contentType: StorageContentTypes,
  ): Promise<StorageEntity[]> {
    return this.storageRepository
      .createQueryBuilder('s')
      .where('s.contentType = :contentType', { contentType })
      .andWhere(
        new Brackets((qb) => {
          let paramsCounter = 0
          for (const fileCondition of originalFilesNames) {
            const fileNameCondition = {}
            fileNameCondition[`fileName_${paramsCounter}`] = fileCondition['fileName']
            const formatCondition = {}
            formatCondition[`format_${paramsCounter}`] = fileCondition['fileExt']

            qb.orWhere(
              new Brackets((qb) => {
                qb.andWhere(`s.fileName = :fileName_${paramsCounter}`, fileNameCondition).andWhere(
                  `s.format = :format_${paramsCounter}`,
                  formatCondition,
                )
              }),
            )
            paramsCounter++
          }
        }),
      )
      .getMany()
  }

  async getStorageItemsByIds(storageFilesIds: string[]): Promise<StorageEntity[]> {
    return this.storageRepository.findBy({ id: In(storageFilesIds) })
  }

  async removeStorageItems(storageItems: StorageEntity[]): Promise<StorageEntity[]> {
    return this.storageRepository.remove(storageItems)
  }

  async getStorageItemsByFilterParams(
    contentType: StorageContentTypes,
    filterParams: StorageListingOptionsDTO,
  ): Promise<{ entities: StorageEntity[]; totalCount: number }> {
    const queryBuilder = this.storageRepository
      .createQueryBuilder('s')
      .where('s."contentType"=:contentType', { contentType })
      .andWhere('s."isSystem"=FALSE')

    if (filterParams.search) {
      queryBuilder.andWhere('s."fileName" ILIKE :fileName', { fileName: `%${filterParams.search}%` })
    }

    const totalCount = await queryBuilder.getCount()
    const preparedOrder = PaginationOptionsDTO.parseOrder(filterParams.order)

    queryBuilder
      .addSelect('s.createAt')
      .addSelect('s.updateAt')
      .orderBy(`s."${preparedOrder.field}"`, preparedOrder.sort)
      .skip((filterParams.page - 1) * filterParams.take)
      .take(filterParams.take)

    const entities = await queryBuilder.getMany()

    return { entities, totalCount }
  }

  getStorageItemById(storageItemId: string): Promise<StorageEntity> {
    return this.storageRepository.findOneBy({ id: storageItemId })
  }

  updateStorageItem(storageItem: StorageEntity, updateData: QueryDeepPartialEntity<StorageEntity>) {
    return this.storageRepository.update({ id: storageItem.id }, updateData)
  }
}
