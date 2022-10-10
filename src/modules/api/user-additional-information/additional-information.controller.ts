import { ForbiddenResponse } from './../../../core/dtos/response/forbidden.dto'
import { Body, Controller, Get, Put, Req } from '@nestjs/common'
import { ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AdditionalInformationService } from './additional-information.service'
import { AdditionalInformationResponseDto } from './dto/additional-information-response.dto'
import { PutAdditionalInformationParamsDto } from './dto/additional-information.dto'

@ApiTags('User Additional Information')
@Controller('user/additional-information')
export class AdditionalInformationController {
  constructor(private additionalInformationService: AdditionalInformationService) {}

  @Get()
  @ApiOkResponse({ type: AdditionalInformationResponseDto })
  @ApiForbiddenResponse({ type: ForbiddenResponse })
  public getAdditionalInformationByUserId(@Req() { user }): Promise<AdditionalInformationResponseDto> {
    return this.additionalInformationService.getAdditionalInformationByUserId(user.id)
  }

  @Put()
  @ApiOkResponse({ type: AdditionalInformationResponseDto })
  @ApiForbiddenResponse({ type: ForbiddenResponse })
  public saveAdditionalInformationByUserId(@Req() { user }, @Body() body: PutAdditionalInformationParamsDto) {
    return this.additionalInformationService.saveAdditionalInformationByUserId(user.id, body.value)
  }
}
