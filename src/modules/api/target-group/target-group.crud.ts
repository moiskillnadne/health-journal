import { In, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TargetGroupEntity } from '../../../database/entities/target-group.entity'

@Injectable()
export class TargetGroupCrud {
  constructor(
    @InjectRepository(TargetGroupEntity) private targetGroupEntityRepository: Repository<TargetGroupEntity>,
  ) {}

  getTargetGroupsLists(): Promise<TargetGroupEntity[]> {
    return this.targetGroupEntityRepository.find()
  }

  async getTargetGroupTags(): Promise<Record<string, string>> {
    const targetGroups = await this.targetGroupEntityRepository.find()

    return targetGroups.reduce((result, item) => {
      result[item.tag] = item.id

      return result
    }, {})
  }

  getTargetGroupsByIds(ids: string[]): Promise<TargetGroupEntity[]> {
    return this.targetGroupEntityRepository.findBy({ id: In(ids) })
  }
}
