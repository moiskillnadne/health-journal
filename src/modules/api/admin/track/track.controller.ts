import { Body, Controller, Post, Query, Get, Patch } from '@nestjs/common'
import { AddTrackDTO, AddTrackResponseDTO } from './dto/track-add.dto'
import { TrackAddService } from './service/track-add.service'
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetTrackResponseDTO, TrackListingOptionsDTO, TrackResponseDTO } from './dto/track.dto'
import { TrackService } from './service/track.service'
import { PageDTO } from '../../../../core/dtos/pagination'
import { ApiPageResponse } from '../../../../core/decorators/swagger/api-page-response.decorator'
import { ParamUIID } from '../../../../core/decorators/param-uiid.decorator'
import { PatchTrackDTO } from './dto/track-update.dto'
import { TrackUpdateService } from './service/track-update.service'
import { RequirePermissions } from '../../../../core/decorators/permissions.decorators'
import { TrackPermissions } from '../../../../constants/permissions/admin.constants'

@ApiTags('Admin Tracks')
@Controller('/web-admin/track')
@ApiExtraModels(PageDTO, GetTrackResponseDTO)
export class TrackController {
  constructor(
    private trackService: TrackService,
    private trackAddService: TrackAddService,
    private trackUpdateService: TrackUpdateService,
  ) {}

  @Post()
  @ApiResponse({ status: 201, type: AddTrackResponseDTO })
  @RequirePermissions(TrackPermissions.canCreate)
  addTrack(@Body() addTrackDTO: AddTrackDTO) {
    return this.trackAddService.addTrack(addTrackDTO)
  }

  @Get()
  @ApiPageResponse(GetTrackResponseDTO, { status: 200 })
  @RequirePermissions(TrackPermissions.canView)
  getTracksList(@Query() trackListingOptions: TrackListingOptionsDTO) {
    return this.trackService.getTracksList(trackListingOptions)
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: TrackResponseDTO })
  @RequirePermissions(TrackPermissions.canUpdate)
  updateTrack(@ParamUIID('id') id: string, @Body() patchTrackDTO: PatchTrackDTO) {
    return this.trackUpdateService.updateTrack(id, patchTrackDTO)
  }
}
