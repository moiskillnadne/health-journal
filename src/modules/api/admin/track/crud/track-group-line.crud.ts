import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { TrackGroupLineEntity } from '../../../../../database/entities/track-group-line.entity'

@Injectable()
export class TrackGroupLineCrud {
  constructor(
    @InjectRepository(TrackGroupLineEntity) private trackGroupLineEntityRepository: Repository<TrackGroupLineEntity>,
  ) {}

  getTrackGroupsLinesListByIds(lineIds: string[], relations: string[] = []) {
    const findOptions = { where: { id: In(lineIds) } }
    if (relations.length) {
      findOptions['relations'] = relations
    }

    return this.trackGroupLineEntityRepository.find(findOptions)
  }
}
