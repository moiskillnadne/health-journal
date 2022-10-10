import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Credentials, S3 } from 'aws-sdk'
import { Environment } from '../../constants/config.constants'
import { InternalServerError } from '../../core/errors/internal-server.error'
import { DictionaryErrorMessages } from '../../constants/responses/messages.error.constants'
import { ErrorCodes } from '../../constants/responses/codes.error.constants'
import { AWSError } from 'aws-sdk/lib/error'
import internal, { PassThrough } from 'stream'
import { SmartStream } from '../../core/stream/smart-stream'
import { OnePartOfMultipartUpload } from '../../models/multipart-upload-part'

@Injectable()
export class S3Service {
  private s3Client: S3

  private config: S3.Types.ClientConfiguration = {
    endpoint: this.configService.get(Environment.S3Endpoint),
    region: this.configService.get(Environment.S3Region),
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    credentials: new Credentials(
      this.configService.get(Environment.AwsAccessKey),
      this.configService.get(Environment.AwsSecretAccesskey),
    ),
  }

  constructor(private configService: ConfigService) {
    this.s3Client = new S3(this.config)
  }

  async uploadFile(
    dataBuffer: Buffer,
    fileKey: string,
    bucketName: string,
  ): Promise<S3.ManagedUpload.SendData | AWSError> {
    try {
      return await this.s3Client
        .upload({
          Body: dataBuffer,
          Bucket: bucketName,
          Key: fileKey,
        })
        .promise()
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsS3InternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }

  uploadFileFromStream(
    fileKey: string,
    bucketName: string,
  ): { writeStream: PassThrough; promise: Promise<S3.ManagedUpload.SendData> } {
    const pass = new PassThrough()
    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Body: pass,
    }

    const uploadManager = this.s3Client.upload(params)

    return {
      writeStream: pass,
      promise: uploadManager.promise(),
    }
  }

  async createMultipartUpload(fileKey: string, bucketName: string): Promise<S3.Types.CreateMultipartUploadOutput> {
    const params: S3.Types.CreateMultipartUploadRequest = {
      Bucket: bucketName,
      Key: fileKey,
    }

    try {
      return this.s3Client.createMultipartUpload(params).promise()
    } catch (err) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsS3InternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...err,
        },
      )
    }
  }

  async uploadPart(
    fileKey: string,
    bucketName: string,
    uploadId: string,
    partNumber: number,
    buffer: Buffer,
  ): Promise<OnePartOfMultipartUpload> {
    const params: S3.Types.UploadPartRequest = {
      Bucket: bucketName,
      Key: fileKey,
      UploadId: uploadId,
      PartNumber: partNumber,
      Body: buffer,
    }

    try {
      const partResult = await this.s3Client.uploadPart(params).promise()
      return { PartNumber: partNumber, ETag: partResult.ETag }
    } catch (err) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsS3InternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...err,
        },
      )
    }
  }

  async completeMultipartUpload(
    fileKey: string,
    bucketName: string,
    uploadId: string,
    parts,
  ): Promise<S3.Types.CompleteMultipartUploadOutput> {
    const params: S3.Types.CompleteMultipartUploadRequest = {
      Bucket: bucketName,
      Key: fileKey,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts,
      },
    }

    try {
      return this.s3Client.completeMultipartUpload(params).promise()
    } catch (err) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsS3InternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...err,
        },
      )
    }
  }

  async deleteFiles(filesKeys: string[], bucketName: string): Promise<S3.Types.DeleteObjectsOutput | AWSError> {
    const params: S3.Types.DeleteObjectsRequest = {
      Bucket: bucketName,
      Delete: {
        Objects: filesKeys.map((fileKey: string) => ({ Key: `${bucketName}/${fileKey}` })),
      },
    }

    try {
      return this.s3Client.deleteObjects(params).promise()
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }

  async getSmartStreamFile(fileKey: string, bucketName: string): Promise<SmartStream> {
    return new Promise((resolve, reject) => {
      const params: S3.Types.HeadObjectRequest = {
        Bucket: bucketName,
        Key: fileKey,
      }

      try {
        this.s3Client.headObject(params, (error, data) => {
          if (error) {
            throw error
          }

          const smartStream = new SmartStream(params, this.s3Client, data.ContentLength)
          resolve(smartStream)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  getPureStreamFile(fileKey: string, bucketName: string, range: string): internal.Readable {
    const params: S3.Types.GetObjectRequest = {
      Bucket: bucketName,
      Key: fileKey,
      Range: range,
    }

    try {
      return this.s3Client.getObject(params).createReadStream()
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }

  getObject(fileKey: string, bucketName: string): Promise<S3.Types.GetObjectOutput> {
    try {
      return this.s3Client
        .getObject({
          Bucket: bucketName,
          Key: fileKey,
        })
        .promise()
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }

  async getPresignedLink(fileKey: string, bucketName: string, expiresInMin: number): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Expires: expiresInMin * 60, // Count min in seconds
    }

    try {
      return this.s3Client.getSignedUrlPromise('getObject', params)
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }

  async checkIfObjectExist(fileKey: string, bucketName: string): Promise<S3.Types.HeadObjectOutput> {
    const params: S3.Types.HeadObjectRequest = {
      Bucket: bucketName,
      Key: fileKey,
    }

    try {
      return this.s3Client.headObject(params).promise()
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }
}
