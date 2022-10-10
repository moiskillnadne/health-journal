import { HttpStatus, Injectable } from '@nestjs/common'
import { StorageEntityService } from './storage-entity.service'
import { S3Service } from '../../../../integrations/s3/s3.service'
import { v4 as uuid } from 'uuid'
import { extension } from 'mime-types'
import { StorageFileFormats } from '../../../../constants/enums/storage.constants'
import * as path from 'path'
import { ConfigService } from '@nestjs/config'
import { Environment } from '../../../../constants/config.constants'
import { IStorageModel, IStorageResponse } from '../../../../models/storage.models'
import { ValidationError } from '../../../../core/errors/validation.error'
import { DictionaryErrorMessages } from '../../../../constants/responses/messages.error.constants'
import { ErrorCodes } from '../../../../constants/responses/codes.error.constants'
import { StorageEntity } from '../../../../database/entities/storage.entity'
import { StorageListingOptionsDTO, StorageUploadParamsDTO } from './storage.dto'
import { PageDTO, PageMetaDTO } from '../../../../core/dtos/pagination'
import { StorageContentTypes } from '../../../../constants/enums/storage.constants'
import { S3 } from 'aws-sdk'
import { AWSError } from 'aws-sdk/lib/error'
import { InternalServerError } from '../../../../core/errors/internal-server.error'

@Injectable()
export class StorageService {
  private bucketName = this.configService.get(Environment.StorageS3BucketName)

  constructor(
    private storageEntityService: StorageEntityService,
    private s3Service: S3Service,
    private configService: ConfigService,
  ) {}

  async uploadMultiPartFiles(
    contentType: StorageContentTypes,
    files: Array<Express.Multer.File>,
    { force }: StorageUploadParamsDTO,
  ) {
    const duplicateOriginalFilesNames = files.map((file) => file.originalname).filter((e, i, a) => a.indexOf(e) !== i)

    const existingStorageFiles = await this.storageEntityService.getExistingFilesByNamesAndExts(
      files.map((file) => ({
        fileName: path.parse(file.originalname).name,
        fileExt: extension(file.mimetype),
      })),
      contentType,
    )

    if (duplicateOriginalFilesNames.length) {
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedDuplicateRequestFile,
        HttpStatus.BAD_REQUEST,
        { filesNames: duplicateOriginalFilesNames },
      )
    }
    const postedExistingFiles = existingStorageFiles.filter((storageItem) => storageItem.isPosted)
    if (!force) {
      if (existingStorageFiles.length) {
        const duplicateFilesNames = Array.from(
          new Set(existingStorageFiles.map((storageFile) => `${storageFile.fileName}.${storageFile.format}`)),
        )
        const postedDuplicateFilesNames = Array.from(
          new Set(postedExistingFiles.map((storageFile) => `${storageFile.fileName}.${storageFile.format}`)),
        )
        const notPostedDuplicateFilesNames = duplicateFilesNames.filter(
          (fileName) => !postedDuplicateFilesNames.includes(fileName),
        )
        throw new ValidationError(
          DictionaryErrorMessages.ValidationFailed,
          ErrorCodes.ValidationFailedDuplicateStorageFile,
          HttpStatus.BAD_REQUEST,
          {
            filesNames: duplicateFilesNames,
            postedFilesNames: postedDuplicateFilesNames,
            notPostedFilesNames: notPostedDuplicateFilesNames,
          },
        )
      }
    } else {
      if (postedExistingFiles.length) {
        throw new ValidationError(
          DictionaryErrorMessages.ValidationFailed,
          ErrorCodes.ValidationFailedSomeReplaceFilesPosted,
          HttpStatus.BAD_REQUEST,
          {
            filesNames: Array.from(
              new Set(existingStorageFiles.map((storageFile) => `${storageFile.fileName}.${storageFile.format}`)),
            ),
          },
        )
      }
    }

    const multipartUploadResults = []
    const filesData = []

    for (const file of files) {
      const fileName = path.parse(file.originalname).name
      const fileExt: StorageFileFormats = extension(file.mimetype)
      const fileDestination = `${contentType}s`
      const uniqFileKey = this.generateUniqFileKey(fileDestination, fileExt)

      filesData.push({
        fileExt,
        fileName,
        fileSize: file.size,
      })

      const chunkSize = Math.pow(1024, 2) * 10 // chunk size is set to 10MB
      const fileSize = file.size
      const iterations = Math.ceil(fileSize / chunkSize) // number of chunks to be broken

      const arr = Array.from(Array(iterations).keys()) // dummy array to loop through

      try {
        const createMultipartUpload = await this.s3Service.createMultipartUpload(uniqFileKey, this.bucketName)

        const partPromises = arr.map((item) =>
          this.s3Service.uploadPart(
            uniqFileKey,
            this.bucketName,
            createMultipartUpload.UploadId,
            item + 1,
            file.buffer.slice(item * chunkSize, (item + 1) * chunkSize),
          ),
        )

        const parts = await Promise.allSettled(partPromises)

        const dataResult = await this.s3Service.completeMultipartUpload(
          uniqFileKey,
          this.bucketName,
          createMultipartUpload.UploadId,
          parts.map((part) => part['value']),
        )

        multipartUploadResults.push(dataResult)
      } catch (err) {}

      const entitiesData: IStorageModel[] = multipartUploadResults.map(
        (uploadResult: S3.ManagedUpload.SendData, index) => ({
          contentType,
          fileName: filesData[index]['fileName'],
          format: filesData[index]['fileExt'],
          size: filesData[index]['fileSize'],
          location: uploadResult.Location,
          bucketKey: uploadResult.Key,
          bucketName: this.bucketName,
        }),
      )

      const savedStorageItems = this.storageEntityService.saveStorageItems(entitiesData)

      return savedStorageItems
    }
  }

  async uploadFiles(
    contentType: StorageContentTypes,
    files: Array<Express.Multer.File>,
    { force }: StorageUploadParamsDTO,
  ): Promise<IStorageResponse[]> {
    const duplicateOriginalFilesNames = files.map((file) => file.originalname).filter((e, i, a) => a.indexOf(e) !== i)

    const existingStorageFiles = await this.storageEntityService.getExistingFilesByNamesAndExts(
      files.map((file) => ({
        fileName: path.parse(file.originalname).name,
        fileExt: extension(file.mimetype),
      })),
      contentType,
    )

    if (duplicateOriginalFilesNames.length) {
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedDuplicateRequestFile,
        HttpStatus.BAD_REQUEST,
        { filesNames: duplicateOriginalFilesNames },
      )
    }

    const postedExistingFiles = existingStorageFiles.filter((storageItem) => storageItem.isPosted)
    if (!force) {
      if (existingStorageFiles.length) {
        const duplicateFilesNames = Array.from(
          new Set(existingStorageFiles.map((storageFile) => `${storageFile.fileName}.${storageFile.format}`)),
        )
        const postedDuplicateFilesNames = Array.from(
          new Set(postedExistingFiles.map((storageFile) => `${storageFile.fileName}.${storageFile.format}`)),
        )
        const notPostedDuplicateFilesNames = duplicateFilesNames.filter(
          (fileName) => !postedDuplicateFilesNames.includes(fileName),
        )
        throw new ValidationError(
          DictionaryErrorMessages.ValidationFailed,
          ErrorCodes.ValidationFailedDuplicateStorageFile,
          HttpStatus.BAD_REQUEST,
          {
            filesNames: duplicateFilesNames,
            postedFilesNames: postedDuplicateFilesNames,
            notPostedFilesNames: notPostedDuplicateFilesNames,
          },
        )
      }
    } else {
      if (postedExistingFiles.length) {
        throw new ValidationError(
          DictionaryErrorMessages.ValidationFailed,
          ErrorCodes.ValidationFailedSomeReplaceFilesPosted,
          HttpStatus.BAD_REQUEST,
          {
            filesNames: Array.from(
              new Set(existingStorageFiles.map((storageFile) => `${storageFile.fileName}.${storageFile.format}`)),
            ),
          },
        )
      }
    }

    if (force && existingStorageFiles.length) {
      const existingStorageFilesBucketKeys = existingStorageFiles.map((storageItem) => storageItem.bucketKey)
      const s3Result = await this.s3Service.deleteFiles(existingStorageFilesBucketKeys, this.bucketName)

      if (s3Result['Deleted'].length > 0) {
        await this.storageEntityService.removeStorageItems(existingStorageFiles)
      }
    }

    const uploadingPromises = []
    const filesData = []
    for (const file of files) {
      const fileName = path.parse(file.originalname).name
      const fileExt: StorageFileFormats = extension(file.mimetype)
      const fileDestination = `${contentType}s`
      const uniqFileKey = this.generateUniqFileKey(fileDestination, fileExt)
      filesData.push({
        fileExt,
        fileName,
        fileSize: file.size,
        uniqFileKey,
      })

      uploadingPromises.push(this.s3Service.uploadFile(file.buffer, uniqFileKey, this.bucketName))
    }

    const result = await Promise.allSettled<Promise<S3.ManagedUpload.SendData | AWSError>[]>(uploadingPromises)

    const areThereFailedUploads = result.filter((uploadResult) => uploadResult.status === 'rejected').length > 0

    if (areThereFailedUploads) {
      const successfulUploadsResults = result
        .filter((uploadPromiseResult) => uploadPromiseResult.status === 'fulfilled')
        .map((uploadPromiseResult: PromiseFulfilledResult<S3.ManagedUpload.SendData>) => uploadPromiseResult.value)
      const successfulUploadedFilesKeys = successfulUploadsResults.map((uploadResult) => uploadResult.Key)

      if (successfulUploadedFilesKeys.length) {
        await this.s3Service.deleteFiles(successfulUploadedFilesKeys, this.bucketName)
      }
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsS3InternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    const uploadingResults = result.map(
      (uploadPromiseResult: PromiseFulfilledResult<S3.ManagedUpload.SendData>) => uploadPromiseResult.value,
    )
    const entitiesData: IStorageModel[] = uploadingResults.map((uploadResult: S3.ManagedUpload.SendData, index) => ({
      contentType,
      fileName: filesData[index]['fileName'],
      format: filesData[index]['fileExt'],
      size: filesData[index]['fileSize'],
      location: uploadResult.Location,
      bucketKey: filesData[index]['uniqFileKey'],
      bucketName: this.bucketName,
    }))

    const savedStorageItems = await this.storageEntityService.saveStorageItems(entitiesData)

    return savedStorageItems
  }

  async deleteFiles(storageFilesIds: string[]): Promise<void> {
    const storageItems = await this.storageEntityService.getStorageItemsByIds(storageFilesIds)
    if (storageFilesIds.length !== storageItems.length) {
      const existStorageItemsIds = storageItems.map((sItem: StorageEntity) => sItem.id)
      const notExistStorageItemsIds = storageFilesIds.filter((key) => !existStorageItemsIds.includes(key))
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedSomeEntitiesNotFound,
        HttpStatus.BAD_REQUEST,
        { ids: notExistStorageItemsIds },
      )
    }

    const postedItems = storageItems.filter((sItem: StorageEntity) => sItem.isPosted)
    if (postedItems.length > 0) {
      const postedStorageItemsIds = postedItems.map((sItem: StorageEntity) => sItem.id)
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedSomeStorageItemsPosted,
        HttpStatus.BAD_REQUEST,
        { ids: postedStorageItemsIds },
      )
    }

    const storageFilesKeys = storageItems.map((sItem: StorageEntity) => sItem.bucketKey)
    await this.s3Service.deleteFiles(storageFilesKeys, this.bucketName)
    await this.storageEntityService.removeStorageItems(storageItems)
  }

  async getStorageItems(
    contentType: StorageContentTypes,
    filterParams: StorageListingOptionsDTO,
  ): Promise<PageDTO<StorageEntity>> {
    const { entities, totalCount } = await this.storageEntityService.getStorageItemsByFilterParams(
      contentType,
      filterParams,
    )

    const pageMetaDto = new PageMetaDTO({ paginationOptionsDto: filterParams, itemCount: totalCount })

    return new PageDTO(entities, pageMetaDto)
  }

  private generateUniqFileKey(destination: string, fileExt: StorageFileFormats): string {
    return `${destination}/${uuid()}.${fileExt}`
  }
}
