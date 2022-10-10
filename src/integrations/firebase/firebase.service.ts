import { Injectable, Logger } from '@nestjs/common'
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api'
import { notificationImagePresignedLinkExpires } from '../../constants/enums/gallery.constants'
import { StorageEntity } from '../../database/entities/storage.entity'
import { UserDeviceCrudService } from '../../modules/api/user-device/user-device.crud'
import { S3Service } from '../s3/s3.service'
import { FirebaseHelperService } from './firebase.helper'
import { MessageParamsDto } from './firebase.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name)
  constructor(
    private firebaseCrudService: FirebaseHelperService,
    private userDeviceCrudService: UserDeviceCrudService,
    private s3Service: S3Service,
    @InjectRepository(StorageEntity)
    protected storageRepository: Repository<StorageEntity>,
  ) {}

  public async sendNotification(userIds: string[], messageParams: MessageParamsDto) {
    const userDevices = await this.userDeviceCrudService.getDevicesByUserIdsWithParams(userIds)

    const userDeviceTokens = userDevices.map((device) => device.fcmToken)

    if (!userDeviceTokens.length) {
      this.logger.warn('No tokens for sending')
      return
    }

    this.logger.log(`User device token prepared to send - ${userDeviceTokens.slice(0, 15)}`)
    const message: MulticastMessage = await this.buildNotificationMessage(userDeviceTokens, messageParams)

    const sendResult = await this.firebaseCrudService.sendMulticastNotification(message)

    const failedTokens = sendResult?.responses?.reduce((acc, resp, index) => {
      if (!resp.success) {
        acc.push(userDeviceTokens[index])
      }

      return acc
    }, [])

    if (failedTokens && failedTokens.length) {
      this.logger.log(`Failed tokens found: ${JSON.stringify(failedTokens)}`)
      await this.userDeviceCrudService.removeDevicesByTokens(failedTokens)
    }

    return sendResult
  }

  private async buildNotificationMessage(tokens: string[], messageParams: MessageParamsDto): Promise<MulticastMessage> {
    let image: StorageEntity | undefined

    if (messageParams.imageId) {
      image = await this.storageRepository.findOneBy({ id: messageParams.imageId })
    }

    let attachmentPresginedLink: string | undefined

    if (image) {
      attachmentPresginedLink = await this.s3Service.getPresignedLink(
        image.bucketKey,
        image.bucketName,
        notificationImagePresignedLinkExpires,
      )
    }

    const message: MulticastMessage = {
      tokens,
      android: {
        priority: 'high',
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
          },
        },
        headers: {
          'apns-push-type': 'background',
          'apns-priority': '5',
          'apns-topic': 'com.vitalopwellnessmobile',
        },
      },
      data: {
        message: JSON.stringify({
          title: messageParams.title,
          body: messageParams.body,
          ios: {
            categoryId: messageParams.data?.type,
            attachments: attachmentPresginedLink
              ? [
                  {
                    url: attachmentPresginedLink,
                  },
                ]
              : [],
          },
          android: {
            channelId: messageParams.data?.type,
            ttl: '86400s',
          },
          data: messageParams.data.payload,
        }),
      },
    }

    return message
  }
}
