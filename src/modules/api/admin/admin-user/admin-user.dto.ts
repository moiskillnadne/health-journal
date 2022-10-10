import { PaginationOptionsDTO } from '../../../../core/dtos/pagination'
import { Matches, IsOptional, IsBoolean } from 'class-validator'
import { messageWrapper } from '../../../../core/helpers/class-validation'
import { defaultOrderValue, orderFieldPattern } from '../../../../constants/validations/admin-user.constants'
import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { UserAdminEntity } from '../../../../database/entities/user-admin.entity'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class AdminUserPaginationOptionsDTO extends PaginationOptionsDTO {
  @ApiPropertyOptional({
    name: 'order',
    default: defaultOrderValue,
    enum: ['createAt asc', 'createAt desc', 'lastLoginAt asc', 'lastLoginAt desc', 'updateAt asc', 'updateAt desc'],
  })
  @IsOptional()
  @Matches(orderFieldPattern, messageWrapper(DictionaryPathToken.InvalidOrderOptionFormatAdminUsers))
  readonly order?: string = defaultOrderValue
}

export class AdminUserSwitchStatusDTO {
  @IsBoolean()
  readonly isActive: boolean
}

export class GetAdminUserResponseDTO extends UserAdminEntity {}
export class PatchAdminUserResponseDTO extends UserAdminEntity {}
