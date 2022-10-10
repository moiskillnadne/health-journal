import { UserDeviceEntity } from './../../../../database/entities/user-dervice.entity'
import { OmitType } from '@nestjs/swagger'

export class GetUserDevicesParamsDto extends OmitType(UserDeviceEntity, ['user'] as const) {}
