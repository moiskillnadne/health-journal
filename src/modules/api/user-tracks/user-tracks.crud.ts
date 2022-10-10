import { FindManyOptions, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Order } from '../../../constants/enums/pagination.constants'

import { UserTracksEntity } from '../../../database/entities/user-tracks.entity'

@Injectable()
export class UserTracksCrudService {
  constructor(
    @InjectRepository(UserTracksEntity)
    protected userTracksRepository: Repository<UserTracksEntity>,
  ) {}

  public async getUserTracksByParams(
    userId: string,
    params: FindManyOptions<UserTracksEntity>,
  ): Promise<UserTracksEntity[]> {
    return this.getTracksByParams({
      ...params,
      where: {
        userId,
        ...params.where,
      },
    })
  }

  public async getTracksByParams(params: FindManyOptions<UserTracksEntity>): Promise<UserTracksEntity[]> {
    return this.userTracksRepository.find({
      ...params,
      order: {
        track: {
          groups: {
            order: Order.ASC,
            lines: {
              order: Order.ASC,
            },
          },
        },
        ...params.order,
      },
    })
  }

  public async addUserTrackByParams(userId: string, params: Partial<UserTracksEntity>): Promise<UserTracksEntity> {
    return this.userTracksRepository.save({ userId, ...params })
  }
}
