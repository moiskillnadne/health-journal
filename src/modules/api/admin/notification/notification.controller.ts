import { Body, Controller, Post, Get, Query, Patch } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  AddCustomNotificationDTO,
  CustomNotificationsListingOptionsDTO,
  GetCustomNotificationResponseDTO,
  GetPredefinedNotificationResponseDTO,
  PatchCustomNotificationDTO,
  PatchCustomNotificationResponseDTO,
  PatchPredefinedNotificationDTO,
  PatchPredefinedNotificationResponseDTO,
  PostCustomNotificationResponseDTO,
  PredefinedNotificationsListingOptionsDTO,
} from './notification.dto'
import { NotificationService } from './notification.service'
import { ParamUIID } from '../../../../core/decorators/param-uiid.decorator'
import { PageDTO } from '../../../../core/dtos/pagination'
import { ApiPageResponse } from '../../../../core/decorators/swagger/api-page-response.decorator'
import { ForbiddenResponse } from '../../../../core/dtos/response/forbidden.dto'
import { NotFoundResponse } from '../../../../core/dtos/response/not-found-error.dto'
import { RequirePermissions } from '../../../../core/decorators/permissions.decorators'
import {
  CustomNotificationPermissions,
  PredefinedNotificationPermissions,
} from '../../../../constants/permissions/admin.constants'

@ApiTags('Admin Notifications Management')
@Controller('/web-admin/notification')
@ApiExtraModels(PageDTO, GetPredefinedNotificationResponseDTO, GetCustomNotificationResponseDTO)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('/custom')
  @ApiPageResponse(GetCustomNotificationResponseDTO, { status: 200 })
  @ApiResponse({ status: 403, description: 'Forbidden', type: ForbiddenResponse })
  @RequirePermissions(CustomNotificationPermissions.canView)
  getCustomNotifications(@Query() options: CustomNotificationsListingOptionsDTO) {
    return this.notificationService.getCustomNotifications(options)
  }

  @Post('/custom')
  @ApiResponse({ status: 201, type: PostCustomNotificationResponseDTO })
  @ApiResponse({ status: 403, description: 'Forbidden', type: ForbiddenResponse })
  @RequirePermissions(CustomNotificationPermissions.canCreate)
  addCustomNotification(@Body() addCustomNotificationDTO: AddCustomNotificationDTO) {
    return this.notificationService.addCustomNotification(addCustomNotificationDTO)
  }

  @Patch('/custom/:id')
  @ApiResponse({ status: 200, type: PatchCustomNotificationResponseDTO })
  @ApiResponse({ status: 403, description: 'Forbidden', type: ForbiddenResponse })
  @RequirePermissions(CustomNotificationPermissions.canUpdate)
  updateCustomNotification(
    @ParamUIID('id') id: string,
    @Body() patchCustomNotificationDTO: PatchCustomNotificationDTO,
  ) {
    return this.notificationService.patchCustomNotification(id, patchCustomNotificationDTO)
  }

  @Get('/predefined')
  @ApiPageResponse(GetPredefinedNotificationResponseDTO, { status: 200 })
  @ApiResponse({ status: 403, description: 'Forbidden', type: ForbiddenResponse })
  @ApiResponse({ status: 404, description: 'Entity not found', type: NotFoundResponse })
  @RequirePermissions(PredefinedNotificationPermissions.canView)
  getPredefinedNotifications(@Query() options: PredefinedNotificationsListingOptionsDTO) {
    return this.notificationService.getPredefinedNotifications(options)
  }

  @Patch('/predefined/:id')
  @ApiResponse({ status: 200, type: PatchPredefinedNotificationResponseDTO })
  @ApiResponse({ status: 403, description: 'Forbidden', type: ForbiddenResponse })
  @ApiResponse({ status: 404, description: 'Entity not found', type: NotFoundResponse })
  @RequirePermissions(PredefinedNotificationPermissions.canUpdate)
  updatePredefinedNotification(
    @ParamUIID('id') id: string,
    @Body() patchPredefinedNotificationDTO: PatchPredefinedNotificationDTO,
  ) {
    return this.notificationService.updatePredefinedNotification(id, patchPredefinedNotificationDTO)
  }
}
