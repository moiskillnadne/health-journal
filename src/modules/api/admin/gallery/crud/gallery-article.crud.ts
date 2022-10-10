import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository, Not, In } from 'typeorm'
import { GalleryArticleEntity } from '../../../../../database/entities/gallery-article.entity'
import { GalleryArticlesListingOptionsDTO } from '../gallery.dto'
import { PaginationOptionsDTO } from '../../../../../core/dtos/pagination'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { StorageEntity } from '../../../../../database/entities/storage.entity'

@Injectable()
export class GalleryArticleCrud {
  constructor(
    @InjectRepository(GalleryArticleEntity) private galleryArticleEntityRepository: Repository<GalleryArticleEntity>,
  ) {}

  save(article: Partial<GalleryArticleEntity>): Promise<GalleryArticleEntity> {
    return this.galleryArticleEntityRepository.save(article)
  }

  removeGalleryArticle(galleryArticle: GalleryArticleEntity) {
    return this.galleryArticleEntityRepository.remove(galleryArticle)
  }

  getGalleryArticleById(galleryArticleId: string, relations = []): Promise<GalleryArticleEntity> {
    const findOptions = { where: { id: galleryArticleId } }
    if (relations) {
      findOptions['relations'] = relations
    }
    return this.galleryArticleEntityRepository.findOne(findOptions)
  }

  getGalleryArticlesByIds(galleryArticlesIds: string[]) {
    return this.galleryArticleEntityRepository.findBy({ id: In(galleryArticlesIds) })
  }

  update(
    galleryArticle: GalleryArticleEntity,
    updateFields: QueryDeepPartialEntity<GalleryArticleEntity>,
    updateRelations: { [key: string]: { add: []; remove: [] } },
  ): Promise<void> {
    if (Object.keys(updateFields) || Object.keys(updateFields)) {
      const updateData = { ...updateFields, updateAt: new Date() }
      return this.galleryArticleEntityRepository.manager.transaction<void>(async (em) => {
        if (Object.values(updateData)) {
          await em.update(GalleryArticleEntity, { id: galleryArticle.id }, updateData)
        }
        const updateRelationsPromises = []
        for (const relationField of Object.keys(updateRelations)) {
          updateRelationsPromises.push(
            em
              .createQueryBuilder()
              .relation(GalleryArticleEntity, relationField)
              .of(galleryArticle)
              .addAndRemove(updateRelations[relationField]['add'], updateRelations[relationField]['remove']),
          )
        }

        if (updateRelationsPromises.length) {
          const saveRelationsResult = await Promise.allSettled<Promise<void>[]>(updateRelationsPromises)
          const areThereFails =
            saveRelationsResult.filter((saveRelationsResult) => saveRelationsResult.status === 'rejected').length > 0

          if (areThereFails) {
            throw new Error('Updating failed')
          }
        }
      })
    }
    return Promise.resolve()
  }

  searchByParams(search: string | null, isPublished: boolean | null) {
    const qb = this.galleryArticleEntityRepository
      .createQueryBuilder('ga')
      .addSelect('ga.createAt')
      .addSelect('ga.updateAt')
      .leftJoinAndSelect('ga.image', 'image')
      .leftJoinAndSelect('ga.conditions', 'conditions')
      .leftJoinAndSelect('ga.medications', 'medications')
      .leftJoinAndSelect('ga.triggers', 'triggers')

    if (search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.orWhere(
            new Brackets((qb) => {
              qb.orWhere(`ga.titleEn ILIKE :titleEn`, { titleEn: `%${search}%` }).orWhere(`ga.titleSp ILIKE :titleSp`, {
                titleSp: `%${search}%`,
              })
            }),
          ).orWhere(
            new Brackets((qb) => {
              qb.orWhere(`array_to_string(ga."keywordsEn", '| |') ILIKE :keywordsEn`, {
                keywordsEn: `%${search}%`,
              }).orWhere(`array_to_string(ga."keywordsSp", '| |') ILIKE :keywordsSp`, { keywordsSp: `%${search}%` })
            }),
          )
        }),
      )
    }

    if (typeof isPublished === 'boolean') {
      qb.andWhere({
        isPublished: isPublished,
      })
    }

    return qb.getMany()
  }

  async getItemsByFilterParams(
    filterParams: GalleryArticlesListingOptionsDTO,
  ): Promise<{ entities: GalleryArticleEntity[]; totalCount: number }> {
    const queryBuilder = this.galleryArticleEntityRepository.createQueryBuilder('ga')
    const preparedOrder = PaginationOptionsDTO.parseOrder(filterParams.order)
    const itemCount = await queryBuilder.getCount()

    queryBuilder
      .addSelect('ga.createAt')
      .addSelect('ga.updateAt')
      .leftJoinAndSelect('ga.image', 'image')
      .leftJoinAndSelect('ga.conditions', 'conditions')
      .leftJoinAndSelect('ga.medications', 'medications')
      .leftJoinAndSelect('ga.triggers', 'triggers')
      .orderBy(`ga.${preparedOrder.field}`, preparedOrder.sort)
      .skip((filterParams.page - 1) * filterParams.take)
      .take(filterParams.take)
    const entities = await queryBuilder.getMany()

    return { entities, totalCount: itemCount }
  }

  async areThereArticlesThatUseImage(storageImage: StorageEntity, excludeArticle?: GalleryArticleEntity) {
    return (
      (await this.galleryArticleEntityRepository.countBy({
        ...{ image: storageImage },
        ...(excludeArticle ? { id: Not(excludeArticle.id) } : {}),
      })) > 0
    )
  }
}
