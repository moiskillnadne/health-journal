import { DictionaryPathToken } from './../../../constants/dictionary.constants'
import { I18nContext } from 'nestjs-i18n'
import { UserDeviceCrudService } from './user-device.crud'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PostUserDeviceParamsDto } from './dtos/user-device.dto'
import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'

@Injectable()
export class UserDeviceService {
  constructor(private userDeviceCrudService: UserDeviceCrudService) {}

  public async findDevicesByUserId(userId: string) {
    const userDevices = await this.userDeviceCrudService.getDevicesByUserIdsWithParams([userId])

    return userDevices
  }

  public async saveDeviceByUserId(
    userId: string,
    params: PostUserDeviceParamsDto,
    i18n: I18nContext,
  ): Promise<BaseSuccessResponse> {
    if (!(await this.userDeviceCrudService.isDeviceTokenExist(params?.fcmToken))) {
      await this.userDeviceCrudService.saveUserDeviceByUserId(userId, params?.fcmToken)
    }

    return {
      code: SuccessCodes.UserDeviceCreated,
      httpCode: HttpStatus.CREATED,
      message: i18n.t(DictionaryPathToken.DeviceSaved),
    }
  }

  public async removeUserDevicesByParams(
    userId: string,
    params: PostUserDeviceParamsDto,
  ): Promise<BaseSuccessResponse> {
    await this.userDeviceCrudService.removeUserDevicesByParams({ userId, fcmToken: params.fcmToken })

    return {
      code: SuccessCodes.UserDeviceDeleted,
      httpCode: HttpStatus.OK,
    }
  }
}
