import { Injectable } from '@nestjs/common'
import { UserCardCrudService } from '../user-card/user-card.crud'
import { GetUserCardHeightResponseDto } from './dto/user-card-height-response.dto'

@Injectable()
export class UserCardHeightService {
  constructor(private userCardCrudService: UserCardCrudService) {}

  public async getUserHeight(userId: string): Promise<GetUserCardHeightResponseDto> {
    const userCardHeight = await this.userCardCrudService.getUserCardByUserIdWithParams(userId, {
      select: {
        heightCm: true,
        heightFt: true,
        heightIn: true,
      },
    })

    return {
      value: {
        ft: userCardHeight.heightFt,
        in: userCardHeight.heightIn,
        cm: userCardHeight.heightCm,
      },
    }
  }
}
