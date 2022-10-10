import { Injectable } from '@nestjs/common'

import { UserCardBmiCrudService } from './user-card-bmi.crud'

import { GetUserLastBmiResponseDto } from './dto/user-card-bmi.response.dto'

@Injectable()
export class UserCardBmiService {
  constructor(private userCardBmiCrudService: UserCardBmiCrudService) {}

  public async getUserLastBmiByUserId(userId: string): Promise<GetUserLastBmiResponseDto> {
    return this.userCardBmiCrudService.getUserLastBmiByUserId(userId)
  }
}
