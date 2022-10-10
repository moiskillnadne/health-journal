import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, In, Not, Repository } from 'typeorm'
import { GalleryRecipeEntity } from '../../../../../database/entities/gallery-recipe.entity'
import { GalleryRecipesListingOptionsDTO } from '../gallery.dto'
import { PaginationOptionsDTO } from '../../../../../core/dtos/pagination'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { StorageEntity } from '../../../../../database/entities/storage.entity'

@Injectable()
export class GalleryRecipeCrud {
  constructor(
    @InjectRepository(GalleryRecipeEntity) private galleryRecipeEntityRepository: Repository<GalleryRecipeEntity>,
  ) {}

  save(recipe: Partial<GalleryRecipeEntity>): Promise<GalleryRecipeEntity> {
    return this.galleryRecipeEntityRepository.save(recipe)
  }

  removeGalleryRecipe(galleryRecipe: GalleryRecipeEntity) {
    return this.galleryRecipeEntityRepository.remove(galleryRecipe)
  }

  getGalleryRecipeById(galleryRecipeId: string, relations = []): Promise<GalleryRecipeEntity> {
    const findOptions = { where: { id: galleryRecipeId } }
    if (relations) {
      findOptions['relations'] = relations
    }
    return this.galleryRecipeEntityRepository.findOne(findOptions)
  }

  getGalleryRecipesByIds(galleryRecipesIds: string[]) {
    return this.galleryRecipeEntityRepository.findBy({ id: In(galleryRecipesIds) })
  }

  update(
    galleryRecipe: GalleryRecipeEntity,
    updateFields: QueryDeepPartialEntity<GalleryRecipeEntity>,
    updateRelations: { [key: string]: { add: []; remove: [] } } = {},
  ): Promise<void> {
    if (Object.keys(updateRelations) || Object.keys(updateFields)) {
      const updateData = { ...updateFields, ...{ updateAt: new Date() } }
      return this.galleryRecipeEntityRepository.manager.transaction<void>(async (em) => {
        if (Object.values(updateData)) {
          await em.update(GalleryRecipeEntity, { id: galleryRecipe.id }, updateData)
        }
        const updateRelationsPromises = []
        for (const relationField of Object.keys(updateRelations)) {
          updateRelationsPromises.push(
            em
              .createQueryBuilder()
              .relation(GalleryRecipeEntity, relationField)
              .of(galleryRecipe)
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
    const qb = this.galleryRecipeEntityRepository
      .createQueryBuilder('gr')
      .addSelect('gr.createAt')
      .addSelect('gr.updateAt')
      .leftJoinAndSelect('gr.image', 'image')

    if (search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.orWhere(
            new Brackets((qb) => {
              qb.orWhere(`gr.titleEn ILIKE :titleEn`, { titleEn: `%${search}%` }).orWhere(`gr.titleSp ILIKE :titleSp`, {
                titleSp: `%${search}%`,
              })
            }),
          ).orWhere(
            new Brackets((qb) => {
              qb.orWhere(`array_to_string(gr."keywordsEn", '| |') ILIKE :keywordsEn`, {
                keywordsEn: `%${search}%`,
              }).orWhere(`array_to_string(gr."keywordsSp", '| |') ILIKE :keywordsSp`, { keywordsSp: `%${search}%` })
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
    filterParams: GalleryRecipesListingOptionsDTO,
  ): Promise<{ entities: GalleryRecipeEntity[]; totalCount: number }> {
    const queryBuilder = this.galleryRecipeEntityRepository.createQueryBuilder('gr')
    const preparedOrder = PaginationOptionsDTO.parseOrder(filterParams.order)
    const itemCount = await queryBuilder.getCount()

    queryBuilder
      .addSelect('gr.createAt')
      .addSelect('gr.updateAt')
      .leftJoinAndSelect('gr.image', 'image')
      .orderBy(`gr.${preparedOrder.field}`, preparedOrder.sort)
      .skip((filterParams.page - 1) * filterParams.take)
      .take(filterParams.take)
    const entities = await queryBuilder.getMany()

    return { entities, totalCount: itemCount }
  }

  async areThereRecipesThatUseImage(storageImage: StorageEntity, excludeRecipe?: GalleryRecipeEntity) {
    return (
      (await this.galleryRecipeEntityRepository.countBy({
        ...{ image: storageImage },
        ...(excludeRecipe ? { id: Not(excludeRecipe.id) } : {}),
      })) > 0
    )
  }
}
