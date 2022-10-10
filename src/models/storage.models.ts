import { StorageContentTypes, StorageFileFormats } from '../constants/enums/storage.constants'

export interface IStorageModel {
  contentType: StorageContentTypes
  fileName: string
  format: StorageFileFormats
  size: number
  location: string
  bucketKey: string
  bucketName: string
  isPosted?: boolean
}

export interface IStorageResponse {
  id: string
  createAt: Date
  contentType: StorageContentTypes
  fileName: string
  format: StorageFileFormats
  size: number
  location: string
  bucketKey: string
  bucketName: string
  isPosted?: boolean
}
