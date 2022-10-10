import { ErrorCodes } from '../../constants/responses/codes.error.constants'
import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { BatchResponse, MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api'
import { InternalServerError } from '../../core/errors/internal-server.error'
import { DictionaryErrorMessages } from '../../constants/responses/messages.error.constants'

@Injectable()
export class FirebaseHelperService {
  private readonly logger = new Logger(FirebaseHelperService.name)

  public async sendMulticastNotification(message: MulticastMessage): Promise<BatchResponse> {
    try {
      const result = await admin.messaging().sendMulticast(message)
      return result
    } catch (e) {
      this.logger.error(e)
    }
  }

  private buildFirebaseException(details: Record<string, unknown> = {}) {
    return new InternalServerError(
      DictionaryErrorMessages.FirebaseInternalError,
      ErrorCodes.FirebaseInternalError,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    )
  }
}
