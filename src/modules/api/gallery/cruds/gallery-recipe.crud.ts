import { Brackets, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { StorageListingOptionsDTO } from '../../admin/storage/storage.dto'

import { GalleryRecipeEntity } from '../../../../database/entities/gallery-recipe.entity'
import { GetRecipesListParamsDto } from '../../food/dto/food.dto'
import { PageMetaDTO, PageDTO } from '../../../../core/dtos/pagination'

@Injectable()
export class GalleryRecipeCrudService {
  constructor(
    @InjectRepository(GalleryRecipeEntity) private galleryRecipeEntityRepository: Repository<GalleryRecipeEntity>,
  ) {}

  public getRecipeQueryByParams(params: StorageListingOptionsDTO): string {
    const queryBuilder = this.galleryRecipeEntityRepository.createQueryBuilder('gr')

    queryBuilder.leftJoinAndSelect('gr.image', 'i')

    queryBuilder
      .select([
        '"titleEn"',
        '"titleSp"',
        '"textEn"',
        '"textSp"',
        '"summaryEn"',
        '"summarySp"',
        '"keywordsEn"',
        '"keywordsSp"',
        'false as "isArticle"',
      ])
      .addSelect('gr.id', 'id')
      .addSelect('i.bucketKey', 'bucketKey')
      .addSelect('i.bucketName', 'bucketName')
      .addSelect('gr.createAt', 'createAt')
      .where('gr.isPublished = true')

    if (params.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.orWhere(
            new Brackets((qb) => {
              qb.orWhere(`"titleEn" ILIKE '%${params.search}%'`).orWhere(`"titleSp" ILIKE '%${params.search}%'`)
            }),
          ).orWhere(
            new Brackets((qb) => {
              qb.orWhere(`"keywordsEn"::TEXT ILIKE '%${params.search}%'`).orWhere(
                `"keywordsSp"::TEXT ILIKE '%${params.search}%'`,
              )
            }),
          )
        }),
      )
    }

    return queryBuilder.getQuery()
  }

  public async getRecipeById(id: string): Promise<GalleryRecipeEntity> {
    const queryBuilder = this.galleryRecipeEntityRepository.createQueryBuilder('gr')

    queryBuilder.leftJoinAndSelect('gr.image', 'i')

    queryBuilder
      .select([
        '"titleEn"',
        '"titleSp"',
        '"textEn"',
        '"textSp"',
        '"summaryEn"',
        '"summarySp"',
        '"keywordsEn"',
        '"keywordsSp"',
        'false as "isArticle"',
      ])
      .addSelect('gr.id', 'id')
      .addSelect('i.bucketKey', 'bucketKey')
      .addSelect('i.bucketName', 'bucketName')
      .addSelect('gr.createAt', 'createAt')
      .where('gr.id = :id', { id })
      .andWhere('gr.isPublished = true')
      .andWhere('i.bucketKey IS NOT NULL')
      .andWhere('i.bucketName IS NOT NULL')

    return queryBuilder.getRawOne()
  }

  public async getRecipesWithParams(filterParams: GetRecipesListParamsDto): Promise<PageDTO<GalleryRecipeEntity>> {
    const qb = this.galleryRecipeEntityRepository.createQueryBuilder('rec')

    qb.leftJoinAndSelect('rec.image', 'image')

    qb.addSelect('rec.createAt')
      .addSelect('false as "isArticle"')
      .where('rec.isPublished = :isPublished', { isPublished: true })
      .skip((filterParams.page - 1) * filterParams.take)
      .take(filterParams.take)
      .orderBy('rec.createAt', 'DESC') // From newest to oldest

    if (filterParams.search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.orWhere(
            new Brackets((qb) => {
              qb.orWhere(`rec.titleEn ILIKE :titleEn`, { titleEn: `%${filterParams.search}%` }).orWhere(
                `rec.titleSp ILIKE :titleSp`,
                {
                  titleSp: `%${filterParams.search}%`,
                },
              )
            }),
          ).orWhere(
            new Brackets((qb) => {
              qb.orWhere(`rec."keywordsEn"::TEXT ILIKE :keywordsEn`, {
                keywordsEn: `%${filterParams.search}%`,
              }).orWhere(`rec."keywordsSp"::TEXT ILIKE :keywordsSp`, {
                keywordsSp: `%${filterParams.search}%`,
              })
            }),
          )
        }),
      )
    }

    const itemCount = await qb.getCount()
    const { entities } = await qb.getRawAndEntities()

    const pageMetaDto = new PageMetaDTO({ paginationOptionsDto: filterParams, itemCount })
    return new PageDTO(entities, pageMetaDto)
  }
}
