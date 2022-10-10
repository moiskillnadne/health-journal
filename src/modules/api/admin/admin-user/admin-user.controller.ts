import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Query, Req } from '@nestjs/common'
import { RequirePermissions } from '../../../../core/decorators/permissions.decorators'
import { AdminUsersPermissions } from '../../../../constants/permissions/admin.constants'
import {
  AdminUserPaginationOptionsDTO,
  AdminUserSwitchStatusDTO,
  GetAdminUserResponseDTO,
  PatchAdminUserResponseDTO,
} from './admin-user.dto'
import { AdminUserService } from './admin-user.service'
import { DictionaryErrorMessages } from '../../../../constants/responses/messages.error.constants'
import { ErrorCodes } from '../../../../constants/responses/codes.error.constants'
import { ValidationError } from '../../../../core/errors/validation.error'
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger'
import { PageDTO } from '../../../../core/dtos/pagination'
import { ApiPageResponse } from '../../../../core/decorators/swagger/api-page-response.decorator'
import { ParamUIID } from '../../../../core/decorators/param-uiid.decorator'
import { InternalServerErrorResponse } from '../../../../core/dtos/response/internal-server-error.dto'

@ApiTags('Admin Admin-Users')
@ApiExtraModels(PageDTO, GetAdminUserResponseDTO)
@Controller('/web-admin/admin-users')
export class AdminUserController {
  constructor(private readonly adminUsersService: AdminUserService) {}

  @Get()
  @HttpCode(200)
  @ApiPageResponse(GetAdminUserResponseDTO, { status: 200 })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(AdminUsersPermissions.canView)
  async getAdminUsers(@Query() options: AdminUserPaginationOptionsDTO) {
    return await this.adminUsersService.getAdminUsers(options)
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: PatchAdminUserResponseDTO })
  @RequirePermissions(AdminUsersPermissions.canChangeStatus)
  async switchAdminUserStatus(@ParamUIID('id') id: string, @Body() patchParams: AdminUserSwitchStatusDTO, @Req() req) {
    if (req.user && id === req.user.id) {
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedAdminUserCanNotChangeStatusForHimself,
        HttpStatus.BAD_REQUEST,
      )
    }

    return await this.adminUsersService.switchAdminUserStatus(id, patchParams)
  }
}
