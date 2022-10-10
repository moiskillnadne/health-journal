import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Delete,
  Body,
  Get,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { StorageService } from './storage.service'
import { imageFileFilter, videoFileFilter } from '../../../../core/helpers/file-validation'
import {
  BatchDeleteBodyDTO,
  GetStorageResponseDTO,
  StorageListingOptionsDTO,
  StorageUploadParamsDTO,
} from './storage.dto'
import {
  MaxFileSize,
  StorageContentTypes,
  imagesUploadingLimit,
  videosUploadingLimit,
} from '../../../../constants/enums/storage.constants'
import { RequirePermissions } from '../../../../core/decorators/permissions.decorators'
import { ContentStoragePermissions } from '../../../../constants/permissions/admin.constants'
import { ValidationError } from '../../../../core/errors/validation.error'
import { DictionaryErrorMessages } from '../../../../constants/responses/messages.error.constants'
import { ErrorCodes } from '../../../../constants/responses/codes.error.constants'
import { ApiConsumes, ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator'
import { ForbiddenResponse } from '../../../../core/dtos/response/forbidden.dto'
import { ValidationErrorResponse } from '../../../../core/dtos/response/validation-error.dto'
import { InternalServerErrorResponse } from '../../../../core/dtos/response/internal-server-error.dto'
import { PageDTO } from '../../../../core/dtos/pagination'
import { ApiPageResponse } from '../../../../core/decorators/swagger/api-page-response.decorator'

@ApiTags('Admin Storage')
@Controller('/web-admin/storage')
@ApiExtraModels(PageDTO, GetStorageResponseDTO)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('image/upload')
  @HttpCode(201)
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'files[]', required: true, description: 'Image files' })
  @ApiResponse({ status: 201, type: GetStorageResponseDTO, isArray: true })
  @ApiResponse({ status: 403, description: 'Forbidden', type: ForbiddenResponse })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponse })
  @RequirePermissions(ContentStoragePermissions.canUpload)
  @UseInterceptors(
    FilesInterceptor('files[]', imagesUploadingLimit, {
      limits: { fileSize: MaxFileSize.image },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadImageFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() uploadParams: StorageUploadParamsDTO,
  ) {
    if (files && !files.length) {
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedNoFilesGiven,
        HttpStatus.BAD_REQUEST,
      )
    }

    return await this.storageService.uploadFiles(StorageContentTypes.image, files, uploadParams)
  }

  @Post('video/upload')
  @HttpCode(201)
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'files[]', required: true, description: 'Image files' })
  @ApiResponse({ status: 201, type: GetStorageResponseDTO, isArray: true })
  @ApiResponse({ status: 403, description: 'Forbidden', type: ForbiddenResponse })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponse })
  @RequirePermissions(ContentStoragePermissions.canUpload)
  @UseInterceptors(
    FilesInterceptor('files[]', videosUploadingLimit, {
      limits: { fileSize: MaxFileSize.video },
      fileFilter: videoFileFilter,
    }),
  )
  async uploadVideoFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() uploadParams: StorageUploadParamsDTO,
  ) {
    return await this.storageService.uploadFiles(StorageContentTypes.video, files, uploadParams)
  }

  @Delete('batchDelete')
  @HttpCode(200)
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponse })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(ContentStoragePermissions.canDelete)
  async deleteBath(@Body() body: BatchDeleteBodyDTO): Promise<void> {
    await this.storageService.deleteFiles(body.ids)
  }

  @Get('image')
  @HttpCode(200)
  @ApiPageResponse(GetStorageResponseDTO, { status: 200 })
  @RequirePermissions(ContentStoragePermissions.canView)
  async getStorageImageFiles(@Query() options: StorageListingOptionsDTO) {
    return await this.storageService.getStorageItems(StorageContentTypes.image, options)
  }

  @Get('video')
  @HttpCode(200)
  @ApiPageResponse(GetStorageResponseDTO, { status: 200 })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(ContentStoragePermissions.canView)
  async getStorageVideoFiles(@Query() options: StorageListingOptionsDTO) {
    return await this.storageService.getStorageItems(StorageContentTypes.video, options)
  }
}
