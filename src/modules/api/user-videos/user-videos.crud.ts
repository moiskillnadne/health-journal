import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { UserVideosEntity } from '../../../database/entities/user-videos.entity'

@Injectable()
export class UserVideosCrudService {
  constructor(
    @InjectRepository(UserVideosEntity)
    private userVideoRepository: Repository<UserVideosEntity>,
  ) {}

  public async findByVideoIdAndUserIdOrCreate(
    userId: string,
    videoId: string,
    params?: Partial<UserVideosEntity>,
  ): Promise<UserVideosEntity> {
    const wellnessJourneyItem = await this.userVideoRepository.findOne({
      where: {
        userId,
        galleryItemId: videoId,
      },
    })

    if (!wellnessJourneyItem) {
      let saveOptions: Partial<UserVideosEntity> = {
        userId,
        galleryItemId: videoId,
      }

      if (params) {
        saveOptions = { ...saveOptions, ...params }
      }

      return this.userVideoRepository.save(saveOptions)
    }

    return wellnessJourneyItem
  }

  public findManyByUserIdWithParams(
    userId: string,
    params: FindManyOptions<UserVideosEntity>,
  ): Promise<UserVideosEntity[]> {
    return this.userVideoRepository.find({
      ...params,
      where: {
        userId,
        ...params.where,
      },
    })
  }

  public findOneByIdWithParams(id: string, params: FindOneOptions<UserVideosEntity>): Promise<UserVideosEntity> {
    return this.userVideoRepository.findOne({
      ...params,
      where: {
        id,
        ...params.where,
      },
    })
  }

  public updateById(id: string, params: Partial<UserVideosEntity>) {
    return this.userVideoRepository.update({ id }, { ...params })
  }
}
