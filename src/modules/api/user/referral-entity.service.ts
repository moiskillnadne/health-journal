import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ReferralEntity } from '../../../database/entities/referral.entity'
import { IReferralModel, IReferralResponse } from '../../../models/referral.models'

@Injectable()
export class ReferralEntityService {
  constructor(
    @InjectRepository(ReferralEntity)
    protected referralRepository: Repository<ReferralEntity>,
  ) {}

  async saveReferral(referralInfo: IReferralModel): Promise<IReferralResponse> {
    return this.referralRepository.save(referralInfo)
  }
}
