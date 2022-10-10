import { UserAdditionalInformationEntity } from './../../../database/entities/additional-information.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class AdditionalInformationCrudService {
  constructor(
    @InjectRepository(UserAdditionalInformationEntity)
    private additionalInformationRepository: Repository<UserAdditionalInformationEntity>,
  ) {}

  public getAdditionalInformationById(id: string): Promise<UserAdditionalInformationEntity> {
    return this.additionalInformationRepository.findOne({ where: { id } })
  }

  public getAdditionalInformationByUserId(userId: string): Promise<UserAdditionalInformationEntity> {
    return this.additionalInformationRepository.findOne({ where: { userId } })
  }

  public async upsertAdditionalInformationByUserId(
    userId: string,
    value: string,
  ): Promise<UserAdditionalInformationEntity> {
    const additionalInformation = await this.getAdditionalInformationByUserId(userId)

    if (additionalInformation) {
      await this.additionalInformationRepository.update({ id: additionalInformation.id }, { value })
      return this.getAdditionalInformationById(additionalInformation.id)
    }

    return this.additionalInformationRepository.save({ userId, value })
  }
}
