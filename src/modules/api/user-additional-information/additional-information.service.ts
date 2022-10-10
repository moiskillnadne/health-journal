import { Injectable } from '@nestjs/common'
import { AdditionalInformationCrudService } from './additional-information.crud'
import { AdditionalInformationResponseDto } from './dto/additional-information-response.dto'

@Injectable()
export class AdditionalInformationService {
  constructor(private additionalInformationCrudService: AdditionalInformationCrudService) {}

  public async getAdditionalInformationByUserId(userId: string): Promise<AdditionalInformationResponseDto> {
    return this.additionalInformationCrudService.getAdditionalInformationByUserId(userId)
  }

  public async saveAdditionalInformationByUserId(
    userId: string,
    value: string,
  ): Promise<AdditionalInformationResponseDto> {
    return this.additionalInformationCrudService.upsertAdditionalInformationByUserId(userId, value)
  }
}
