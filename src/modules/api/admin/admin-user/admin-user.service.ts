import { HttpStatus, Injectable } from '@nestjs/common'
import { AdminUserCrud } from './admin-user.crud'
import { AdminUserPaginationOptionsDTO, AdminUserSwitchStatusDTO } from './admin-user.dto'
import { PageDTO, PageMetaDTO } from '../../../../core/dtos/pagination'
import { UserAdminEntity } from '../../../../database/entities/user-admin.entity'
import { ValidationError } from '../../../../core/errors/validation.error'
import { DictionaryErrorMessages } from '../../../../constants/responses/messages.error.constants'
import { ErrorCodes } from '../../../../constants/responses/codes.error.constants'
import { NotFoundError } from '../../../../core/errors/not-found.error'

@Injectable()
export class AdminUserService {
  constructor(private readonly adminUserCrud: AdminUserCrud) {}

  async getAdminUsers(filterParams: AdminUserPaginationOptionsDTO): Promise<PageDTO<UserAdminEntity>> {
    const { entities, totalCount } = await this.adminUserCrud.getAdminUsersByFilterParams(filterParams)
    const pageMetaDto = new PageMetaDTO({ paginationOptionsDto: filterParams, itemCount: totalCount })

    return new PageDTO(entities, pageMetaDto)
  }

  async switchAdminUserStatus(adminUserId: string, patchParams: AdminUserSwitchStatusDTO): Promise<UserAdminEntity> {
    const adminUser = await this.adminUserCrud.getAdminUserById(adminUserId)
    if (!adminUser) {
      throw new NotFoundError(DictionaryErrorMessages.EntityNotFound, ErrorCodes.EntityNotFound, HttpStatus.NOT_FOUND)
    }

    if (adminUser.isActive === patchParams.isActive) {
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        patchParams.isActive
          ? ErrorCodes.ValidationFailedAdminUserAlreadyActive
          : ErrorCodes.ValidationFailedAdminUserAlreadyInactive,
        HttpStatus.BAD_REQUEST,
      )
    }

    adminUser.isActive = patchParams.isActive
    await this.adminUserCrud.updateAdminUser(adminUser)

    return adminUser
  }
}
