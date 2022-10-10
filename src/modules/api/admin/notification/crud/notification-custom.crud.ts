import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NotificationCustomEntity } from '../../../../../database/entities/notification-custom.entity'
import { PaginationOptionsDTO } from '../../../../../core/dtos/pagination'
import { CustomNotificationsListingOptionsDTO } from '../notification.dto'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

@Injectable()
export class NotificationCustomCrud {
  constructor(
    @InjectRepository(NotificationCustomEntity)
    private notificationCustomEntityRepository: Repository<NotificationCustomEntity>,
  ) {}

  getNotificationById(
    id: string,
    relations: Array<keyof NotificationCustomEntity> = [],
  ): Promise<NotificationCustomEntity> {
    const findOptions = { where: { id: id } }
    if (relations) {
      findOptions['relations'] = relations
    }
    return this.notificationCustomEntityRepository.findOne(findOptions)
  }

  save(notification: Partial<NotificationCustomEntity>): Promise<NotificationCustomEntity> {
    return this.notificationCustomEntityRepository.save(notification)
  }

  async getItemsByFilterParams(
    filterParams: CustomNotificationsListingOptionsDTO,
  ): Promise<{ entities: NotificationCustomEntity[]; totalCount: number }> {
    const queryBuilder = this.notificationCustomEntityRepository.createQueryBuilder('nc')
    let preparedOrder

    if (filterParams.order) {
      preparedOrder = PaginationOptionsDTO.parseOrder(filterParams.order)
    }

    if (filterParams.search) {
      queryBuilder.where('nc.name ILIKE :name', { name: `%${filterParams.search}%` })
    }

    if (filterParams.sending_strategy) {
      queryBuilder.andWhere('nc.sending_strategy = :strategy', { strategy: filterParams.sending_strategy })
    }

    if (filterParams.isToday) {
      queryBuilder.andWhere('nc.sending_date = current_date')
    }

    const itemCount = await queryBuilder.getCount()

    queryBuilder
      .addSelect('nc.createAt')
      .addSelect('nc.updateAt')
      .leftJoinAndSelect('nc.image', 'image')
      .leftJoinAndSelect('nc.video', 'video')
      .leftJoinAndSelect('nc.article', 'article')
      .leftJoinAndSelect('nc.recipe', 'recipe')
      .leftJoinAndSelect('nc.targetGroups', 'targetGroups')

    if (preparedOrder) {
      queryBuilder.orderBy(`nc.${preparedOrder.field}`, preparedOrder.sort)
    }

    if (filterParams.page && filterParams.take) {
      queryBuilder.skip((filterParams.page - 1) * filterParams.take).take(filterParams.take)
    }

    const entities = await queryBuilder.getMany()

    return { entities, totalCount: itemCount }
  }

  async update(notification: NotificationCustomEntity, updateFields: QueryDeepPartialEntity<NotificationCustomEntity>) {
    return this.notificationCustomEntityRepository.manager.transaction(async (em) => {
      const dpActionsPromises = []
      if (Object.values(updateFields)) {
        const updateData = { ...updateFields, ...{ updateAt: new Date() } }
        const preparedUpdateData = (({ targetGroups, ...other }) => other)(updateData)
        if (Object.values(preparedUpdateData).length) {
          dpActionsPromises.push(em.update(NotificationCustomEntity, { id: notification.id }, preparedUpdateData))
        }
        if (updateData?.targetGroups && Object.keys(updateData?.targetGroups).length) {
          dpActionsPromises.push(
            em
              .createQueryBuilder()
              .relation(NotificationCustomEntity, 'targetGroups')
              .of(notification)
              .addAndRemove(updateData.targetGroups['add'], updateData.targetGroups['remove']),
          )
        }
      }

      if (dpActionsPromises.length) {
        const dbActionsResult = await Promise.allSettled<Promise<void>[]>(dpActionsPromises)
        const areThereFails = dbActionsResult.filter((promiseResult) => promiseResult.status === 'rejected').length > 0

        if (areThereFails) {
          throw new Error('Updating failed')
        }
      }
    })
  }
}
