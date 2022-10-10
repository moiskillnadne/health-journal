import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, In, Not, Repository } from 'typeorm'
import { GalleryVideoEntity } from '../../../../../database/entities/gallery-video.entity'
import { GalleryVideosListingOptionsDTO } from '../gallery.dto'
import { PaginationOptionsDTO } from '../../../../../core/dtos/pagination'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { StorageEntity } from '../../../../../database/entities/storage.entity'

@Injectable()
export class GalleryVideoCrud {
  constructor(
    @InjectRepository(GalleryVideoEntity) private galleryVideosEntityRepository: Repository<GalleryVideoEntity>,
  ) {}

  save(video: Partial<GalleryVideoEntity>): Promise<GalleryVideoEntity> {
    return this.galleryVideosEntityRepository.save(video)
  }

  removeGalleryVideo(galleryVideo: GalleryVideoEntity) {
    return this.galleryVideosEntityRepository.remove(galleryVideo)
  }

  async update(
    galleryVideo: GalleryVideoEntity,
    updateFields: QueryDeepPartialEntity<GalleryVideoEntity>,
    updateRelations: { [key: string]: { add: []; remove: [] } },
  ): Promise<void> {
    if (Object.keys(updateRelations) || Object.keys(updateFields)) {
      const updateData = { ...updateFields, ...{ updateAt: new Date() } }
      return this.galleryVideosEntityRepository.manager.transaction<void>(async (em) => {
        if (Object.values(updateData)) {
          await em.update(GalleryVideoEntity, { id: galleryVideo.id }, updateData)
        }
        const updateRelationsPromises = []
        for (const relationField of Object.keys(updateRelations)) {
          updateRelationsPromises.push(
            em
              .createQueryBuilder()
              .relation(GalleryVideoEntity, relationField)
              .of(galleryVideo)
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
  }

  getGalleryVideoById(galleryVideoId: string, relations = []): Promise<GalleryVideoEntity> {
    const findOptions = { where: { id: galleryVideoId } }
    if (relations) {
      findOptions['relations'] = relations
    }
    return this.galleryVideosEntityRepository.findOne(findOptions)
  }

  getGalleryVideosByIds(galleryVideoIds: string[]) {
    return this.galleryVideosEntityRepository.findBy({ id: In(galleryVideoIds) })
  }

  searchByParams(search: string | null, isPublished: boolean | null) {
    const qb = this.galleryVideosEntityRepository
      .createQueryBuilder('gv')
      .addSelect('gv.createAt')
      .addSelect('gv.updateAt')
      .leftJoinAndSelect('gv.video', 'video')
      .leftJoinAndSelect('gv.videoPreview', 'videoPreview')
      .leftJoinAndSelect('gv.conditions', 'conditions')
      .leftJoinAndSelect('gv.medications', 'medications')
      .leftJoinAndSelect('gv.triggers', 'triggers')

    if (search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.orWhere(
            new Brackets((qb) => {
              qb.orWhere(`gv.titleEn ILIKE :titleEn`, { titleEn: `%${search}%` }).orWhere(`gv.titleSp ILIKE :titleSp`, {
                titleSp: `%${search}%`,
              })
            }),
          ).orWhere(
            new Brackets((qb) => {
              qb.orWhere(`array_to_string(gv."keywordsEn", '| |') ILIKE :keywordsEn`, {
                keywordsEn: `%${search}%`,
              }).orWhere(`array_to_string(gv."keywordsSp", '| |') ILIKE :keywordsSp`, { keywordsSp: `%${search}%` })
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
    filterParams: GalleryVideosListingOptionsDTO,
  ): Promise<{ entities: GalleryVideoEntity[]; totalCount: number }> {
    const queryBuilder = this.galleryVideosEntityRepository
      .createQueryBuilder('gv')
      .where('gv.type=:type', { type: filterParams.type })
    const preparedOrder = PaginationOptionsDTO.parseOrder(filterParams.order)

    const itemCount = await queryBuilder.getCount()

    queryBuilder
      .addSelect('gv.createAt')
      .addSelect('gv.updateAt')
      .leftJoinAndSelect('gv.video', 'video')
      .leftJoinAndSelect('gv.videoPreview', 'videoPreview')
      .leftJoinAndSelect('gv.conditions', 'conditions')
      .leftJoinAndSelect('gv.medications', 'medications')
      .leftJoinAndSelect('gv.triggers', 'triggers')
      .orderBy(`gv.${preparedOrder.field}`, preparedOrder.sort)
      .skip((filterParams.page - 1) * filterParams.take)
      .take(filterParams.take)
    const entities = await queryBuilder.getMany()

    return { entities, totalCount: itemCount }
  }

  async areThereVideosThatUseVideoPreview(videoPreview: StorageEntity, excludeVideo?: GalleryVideoEntity) {
    return (
      (await this.galleryVideosEntityRepository.countBy({
        ...{ videoPreview: videoPreview },
        ...(excludeVideo ? { id: Not(excludeVideo.id) } : {}),
      })) > 0
    )
  }

  async areThereVideosThatUseVideo(video: StorageEntity, excludeVideo?: GalleryVideoEntity) {
    return (
      (await this.galleryVideosEntityRepository.countBy({
        ...{ video: video },
        ...(excludeVideo ? { id: Not(excludeVideo.id) } : {}),
      })) > 0
    )
  }
}
