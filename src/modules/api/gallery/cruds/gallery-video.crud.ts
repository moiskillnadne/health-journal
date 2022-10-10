import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'
import { VideoTypes } from '../../../../constants/enums/gallery.constants'
import { PageDTO, PageMetaDTO } from '../../../../core/dtos/pagination'
import { GalleryVideoEntity } from '../../../../database/entities/gallery-video.entity'
import { StorageListingOptionsDTO } from '../../admin/storage/storage.dto'
import { GetFoodVideoListParamsDto } from '../../food/dto/food.dto'

@Injectable()
export class GalleryVideosGrudService {
  constructor(
    @InjectRepository(GalleryVideoEntity) private galleryVideosEntityRepository: Repository<GalleryVideoEntity>,
  ) {}

  async getVideos(
    filterParams: StorageListingOptionsDTO | GetFoodVideoListParamsDto,
    videoType?: VideoTypes,
  ): Promise<PageDTO<GalleryVideoEntity>> {
    const queryBuilder = this.galleryVideosEntityRepository.createQueryBuilder('gallery')

    queryBuilder.leftJoinAndSelect('gallery.videoPreview', 'videoPreview')

    queryBuilder
      .addSelect('gallery.createAt')
      .where('gallery.isPublished = :isPublished', { isPublished: true })
      .skip((filterParams.page - 1) * filterParams.take)
      .take(filterParams.take)
      .orderBy('gallery.createAt', 'DESC') // From newest to oldest

    if (videoType) {
      queryBuilder.andWhere('gallery.type = :videoType', { videoType })
    }

    if (filterParams.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.orWhere(
            new Brackets((qb) => {
              qb.orWhere(`gallery.titleEn ILIKE :titleEn`, { titleEn: `%${filterParams.search}%` }).orWhere(
                `gallery.titleSp ILIKE :titleSp`,
                {
                  titleSp: `%${filterParams.search}%`,
                },
              )
            }),
          ).orWhere(
            new Brackets((qb) => {
              qb.orWhere(`gallery."keywordsEn"::TEXT ILIKE :keywordsEn`, {
                keywordsEn: `%${filterParams.search}%`,
              }).orWhere(`gallery."keywordsSp"::TEXT ILIKE :keywordsSp`, {
                keywordsSp: `%${filterParams.search}%`,
              })
            }),
          )
        }),
      )
    }

    const itemCount = await queryBuilder.getCount()
    const { entities } = await queryBuilder.getRawAndEntities()

    const pageMetaDto = new PageMetaDTO({ paginationOptionsDto: filterParams, itemCount })
    return new PageDTO(entities, pageMetaDto)
  }

  async getVideoById(videoId: string): Promise<GalleryVideoEntity> {
    const queryBuilder = this.galleryVideosEntityRepository.createQueryBuilder('gallery')

    queryBuilder
      .leftJoinAndSelect('gallery.video', 'video')
      .where('gallery.id = :videoId', { videoId })
      .andWhere('gallery.isPublished = true')
      .andWhere('video.bucketKey IS NOT NULL')
      .andWhere('video.bucketName IS NOT NULL')

    return queryBuilder.getOne()
  }
}
