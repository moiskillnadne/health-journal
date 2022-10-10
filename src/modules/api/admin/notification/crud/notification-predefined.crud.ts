import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { PaginationOptionsDTO } from '../../../../../core/dtos/pagination'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'

import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'

import { PredefinedNotificationsListingOptionsDTO } from '../notification.dto'

@Injectable()
export class NotificationPredefinedCrud {
  constructor(
    @InjectRepository(NotificationPredefinedEntity)
    private notificationPredefinedEntityRepository: Repository<NotificationPredefinedEntity>,
  ) {}

  update(
    notification: NotificationPredefinedEntity,
    updateFields: QueryDeepPartialEntity<NotificationPredefinedEntity>,
  ) {
    return this.notificationPredefinedEntityRepository.update({ id: notification.id }, updateFields)
  }

  getPredefinedNotificationById(id: string, relations: string[] = []) {
    const findOptions = { where: { id: id } }
    if (relations) {
      findOptions['relations'] = relations
    }
    return this.notificationPredefinedEntityRepository.findOne(findOptions)
  }

  getPredefinedNotificationByType(type: NotificationType) {
    return this.notificationPredefinedEntityRepository.findOne({ where: { type } })
  }

  async getItemsByFilterParams(
    filterParams: PredefinedNotificationsListingOptionsDTO,
  ): Promise<{ entities: NotificationPredefinedEntity[]; totalCount: number }> {
    const queryBuilder = this.notificationPredefinedEntityRepository
      .createQueryBuilder('np')
      .andWhere('np."isActive"=TRUE')
    const preparedOrder = PaginationOptionsDTO.parseOrder(filterParams.order)

    if (filterParams.search) {
      queryBuilder.andWhere('np.name ILIKE :name', { name: `%${filterParams.search}%` })
    }

    const itemCount = await queryBuilder.getCount()

    queryBuilder
      .addSelect('np.createAt')
      .addSelect('np.updateAt')
      .orderBy(`np.${preparedOrder.field}`, preparedOrder.sort)
      .skip((filterParams.page - 1) * filterParams.take)
      .take(filterParams.take)

    const entities = await queryBuilder.getMany()

    return { entities, totalCount: itemCount }
  }
}
