import { Brackets, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { StorageListingOptionsDTO } from '../../admin/storage/storage.dto'

import { GalleryArticleEntity } from '../../../../database/entities/gallery-article.entity'

@Injectable()
export class GalleryArticleCrudService {
  constructor(
    @InjectRepository(GalleryArticleEntity) private galleryArticleEntityRepository: Repository<GalleryArticleEntity>,
  ) {}

  getArticleQueryByParams(params: StorageListingOptionsDTO): string {
    const queryBuilder = this.galleryArticleEntityRepository.createQueryBuilder('ga')

    queryBuilder.leftJoinAndSelect('ga.image', 'i')

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
        'true as "isArticle"',
      ])
      .addSelect('ga.id', 'id')
      .addSelect('i.bucketKey', 'bucketKey')
      .addSelect('i.bucketName', 'bucketName')
      .addSelect('ga.createAt', 'createAt')
      .where('ga.isPublished = true')

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

  async getArticleById(articleId: string): Promise<GalleryArticleEntity> {
    const queryBuilder = this.galleryArticleEntityRepository.createQueryBuilder('ga')

    queryBuilder.leftJoinAndSelect('ga.image', 'i')

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
        'true as "isArticle"',
      ])
      .addSelect('ga.id', 'id')
      .addSelect('i.bucketKey', 'bucketKey')
      .addSelect('i.bucketName', 'bucketName')
      .addSelect('ga.createAt', 'createAt')
      .where('ga.id = :articleId', { articleId })
      .andWhere('ga.isPublished = true')
      .andWhere('i.bucketKey IS NOT NULL')
      .andWhere('i.bucketName IS NOT NULL')

    return queryBuilder.getRawOne()
  }
}
