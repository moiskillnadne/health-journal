import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserCardProfileEntity } from '../../../database/entities/user-card-profile.entity'

@Injectable()
export class UserCardProfileCrudService {
  constructor(
    @InjectRepository(UserCardProfileEntity)
    protected userCardProfileRepository: Repository<UserCardProfileEntity>,
  ) {}

  async upsertUserProfileDataByCardId(
    id: string,
    params: Partial<UserCardProfileEntity>,
  ): Promise<UserCardProfileEntity> {
    const profile = await this.userCardProfileRepository.findOne({ where: { cardId: id } })

    if (profile) {
      await this.userCardProfileRepository.update(profile.id, params)

      return this.userCardProfileRepository.findOne({ where: { cardId: id } })
    }

    return this.userCardProfileRepository.save({ cardId: id, ...params })
  }
}
