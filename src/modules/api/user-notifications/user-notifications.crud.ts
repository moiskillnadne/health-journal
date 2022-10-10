import { Repository, DeleteResult, UpdateResult } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import dataSource from '../../../database/database.config'

import { UserNotificationsPredefinedEntity } from '../../../database/entities/user-notifications-predefined.entity'
import { UserNotificationsCustomEntity } from '../../../database/entities/user-notifications-custom.entity'

import { GetUserNotificationsResponseDto } from './dto/user-notifications.response.dto'
import { CustomNotificationPushTypes } from '../../../constants/enums/notifications.constants'

@Injectable()
export class UserNotificationsCrudService {
  constructor(
    @InjectRepository(UserNotificationsPredefinedEntity)
    protected userNotificationsPredefinedRepository: Repository<UserNotificationsPredefinedEntity>,
    @InjectRepository(UserNotificationsCustomEntity)
    protected userNotificationsCustomRepository: Repository<UserNotificationsCustomEntity>,
  ) {}

  async saveUserCustomNotification(userCustomNotifications: Partial<UserNotificationsCustomEntity>[]) {
    return this.userNotificationsCustomRepository.save(userCustomNotifications)
  }

  async getUserNotificationById(
    id: string,
  ): Promise<UserNotificationsPredefinedEntity | UserNotificationsCustomEntity | null> {
    const [predefined, custom] = await Promise.all([
      this.userNotificationsPredefinedRepository.findOne({ where: { id } }),
      this.userNotificationsCustomRepository.findOne({ where: { id } }),
    ])

    return predefined || custom
  }

  async getUserNotificationsCountByUserId(userId: string): Promise<number> {
    const predefinedQueryBuilder = this.userNotificationsPredefinedRepository.createQueryBuilder()
    const customQueryBuilder = this.userNotificationsCustomRepository.createQueryBuilder()

    const predefinedQuery = predefinedQueryBuilder
      .select('id')
      .where(`"userId" = '${userId}'`)
      .andWhere(`"isViewed" = false`)
      .getQuery()
    const customQuery = customQueryBuilder
      .select('id')
      .where(`"userId" = '${userId}'`)
      .andWhere(`"isViewed" = false`)
      .getQuery()

    const [result] = await dataSource.manager.query(
      `SELECT COUNT(*) FROM (${predefinedQuery} UNION ALL ${customQuery}) AS count`,
    )

    return result.count
  }

  async getUserNotificationsByUserId(userId: string): Promise<GetUserNotificationsResponseDto[]> {
    const predefinedQueryBuilder = this.userNotificationsPredefinedRepository.createQueryBuilder('np')
    const customQueryBuilder = this.userNotificationsCustomRepository.createQueryBuilder('nc')

    const predefinedQuery = predefinedQueryBuilder
      .select(['np.title title', 'np.bodyEn body', 'np.createAt datetime'])
      .addSelect(`json_build_object('categoryId', n."type")`, 'ios')
      .addSelect(`json_build_object('channelId', n."type")`, 'android')
      .addSelect(
        `json_build_object('id', np."id", 'userId', np."userId", 'videoId', video, 'articleId', article, 'recipeId', recipe, 'userAppointmentId', np."appointmentId", 'procedureId', n."procedureId", 'userProcedureId', np."procedureId", 'isViewed', np."isViewed")`,
        'data',
      )
      .leftJoin('np.notification', 'n')
      .leftJoin('n.video', 'video')
      .leftJoin('n.article', 'article')
      .leftJoin('n.recipe', 'recipe')
      .where(`"userId" = '${userId}'`)
      .getQuery()

    const customNotificationPushTypeSelector =
      `(CASE WHEN nc."videoId" IS NOT NULL THEN '${CustomNotificationPushTypes.Video}' ELSE (` +
      `CASE WHEN nc."articleId" IS NOT NULL THEN '${CustomNotificationPushTypes.Article}' ELSE (` +
      `CASE WHEN nc."recipeId" IS NOT NULL THEN '${CustomNotificationPushTypes.Recipe}' ELSE` +
      ` '${CustomNotificationPushTypes.Text}' END) END) END)`

    const customQuery = customQueryBuilder
      .select(['nc.title title', 'nc.bodyEn body', 'nc.createAt datetime'])
      .addSelect(
        `json_build_object('categoryId', ${customNotificationPushTypeSelector}, 'attachments', json_build_object('bucketKey', i."bucketKey", 'bucketName', i."bucketName"))`,
        'ios',
      )
      .addSelect(`json_build_object('channelId', ${customNotificationPushTypeSelector})`, 'android')
      .addSelect(
        `json_build_object('id', nc."id", 'userId', nc."userId", 'videoId', video, 'articleId', article, 'recipeId', recipe, 'isViewed', nc."isViewed")`,
        'data',
      )
      .leftJoin('nc.notification', 'n')
      .leftJoin('nc.image', 'i')
      .leftJoin('nc.video', 'video')
      .leftJoin('nc.article', 'article')
      .leftJoin('nc.recipe', 'recipe')
      .where(`"userId" = '${userId}'`)
      .getQuery()

    return dataSource.manager.query(
      `
      SELECT date(sq."datetime") AS date, json_agg(sq.*) AS items
      FROM (${predefinedQuery} UNION ALL ${customQuery} ORDER BY datetime DESC) AS sq
      GROUP BY date(sq."datetime")
      ORDER BY date(sq."datetime") DESC`,
    )
  }

  async updateUserNotificationsStatusByIds(ids: string[]): Promise<UpdateResult[]> {
    return Promise.all([
      this.userNotificationsPredefinedRepository.update(ids, { isViewed: true }),
      this.userNotificationsCustomRepository.update(ids, { isViewed: true }),
    ])
  }

  async deleteUserNotificationById(id: string): Promise<DeleteResult[]> {
    return Promise.all([
      this.userNotificationsPredefinedRepository.delete(id),
      this.userNotificationsCustomRepository.delete(id),
    ])
  }
}
