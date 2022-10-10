import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { TrackGroupEntity } from '../../../../../database/entities/track-group.entity'

@Injectable()
export class TrackGroupCrud {
  constructor(@InjectRepository(TrackGroupEntity) private trackGroupEntityRepository: Repository<TrackGroupEntity>) {}

  getTrackGroupsListByIds(groupsIds: string[], relations: string[] = []) {
    const findOptions = { where: { id: In(groupsIds) } }
    if (relations.length) {
      findOptions['relations'] = relations
    }

    return this.trackGroupEntityRepository.find(findOptions)
  }
}
