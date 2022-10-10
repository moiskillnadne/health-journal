import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, Repository } from 'typeorm'
import { UserArticlesEntity } from '../../../database/entities/user-articles.entity'

@Injectable()
export class UserArticlesCrudService {
  constructor(
    @InjectRepository(UserArticlesEntity)
    private userArticlesRepository: Repository<UserArticlesEntity>,
  ) {}

  public getQuery(userId: string) {
    const qb = this.userArticlesRepository.createQueryBuilder('ua')

    qb.select(['"isFavorite"', '"isVisited"', '"userId"', '"galleryItemId"'])
      .addSelect('ua.id', 'id')
      .where(`ua.userId = ${userId}`)

    return qb.getQuery()
  }

  public async findByArticleIdAndUserIdOrCreate(
    userId: string,
    articleId: string,
    params?: Partial<UserArticlesEntity>,
  ): Promise<UserArticlesEntity> {
    const userArticleItem = await this.userArticlesRepository.findOne({
      where: {
        userId,
        galleryItemId: articleId,
      },
    })

    if (!userArticleItem) {
      let saveOptions: Partial<UserArticlesEntity> = {
        userId,
        galleryItemId: articleId,
      }

      if (params) {
        saveOptions = { ...saveOptions, ...params }
      }

      return this.userArticlesRepository.save(saveOptions)
    }

    return userArticleItem
  }

  public async findManyByUserIdWithParams(
    userId: string,
    params: FindManyOptions<UserArticlesEntity> = {},
  ): Promise<UserArticlesEntity[]> {
    return this.userArticlesRepository.find({
      ...params,
      where: {
        userId,
        ...params.where,
      },
    })
  }

  public updateById(id: string, params: Partial<UserArticlesEntity>) {
    return this.userArticlesRepository.update({ id }, { ...params })
  }
}
