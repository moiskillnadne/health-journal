import { FindOneOptions, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserCardEntity } from '../../../database/entities/user-card.entity'

@Injectable()
export class UserCardCrudService {
  constructor(
    @InjectRepository(UserCardEntity)
    protected userCardRepository: Repository<UserCardEntity>,
  ) {}

  async getUserCardByUserId(id: string): Promise<UserCardEntity> {
    return this.userCardRepository.findOne({ where: { userId: id } })
  }

  async getUserCardByUserIdWithParams(
    id: string,
    params: FindOneOptions<UserCardEntity> = {},
  ): Promise<UserCardEntity> {
    return this.userCardRepository.findOne({
      ...params,
      where: {
        userId: id,
        ...params.where,
      },
    })
  }

  async createUserCardByUserId(id: string, params: Partial<UserCardEntity>): Promise<UserCardEntity> {
    return this.userCardRepository.save({ userId: id, ...params })
  }

  async upsertUserCardByUserId(id: string, params: Partial<UserCardEntity>): Promise<UserCardEntity> {
    const card = await this.userCardRepository.findOne({ where: { userId: id } })

    if (card) {
      await this.userCardRepository.update(card.id, params)

      return this.userCardRepository.findOne({ where: { userId: id } })
    }

    return this.userCardRepository.save({ userId: id, ...params })
  }

  async updateUserCardById(id: string, params: Partial<UserCardEntity>) {
    return this.userCardRepository.update(id, params)
  }

  async findOrCreateUserCard(userId: string): Promise<UserCardEntity> {
    const card = await this.getUserCardByUserId(userId)

    if (!card) {
      const createdCard = await this.createUserCardByUserId(userId, {})
      return createdCard
    }

    return card
  }
}
