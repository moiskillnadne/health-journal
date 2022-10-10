import { HttpStatus, Request } from '@nestjs/common'
import { AllowedVideoFileFormats, AllowedImageFileFormats } from '../../constants/enums/storage.constants'
import { ValidationError } from '../errors/validation.error'
import { ErrorCodes } from '../../constants/responses/codes.error.constants'
import { DictionaryErrorMessages } from '../../constants/responses/messages.error.constants'
import { extension, extensions } from 'mime-types'

export const imageFileFilter = (req: Request, file: any, callback) => {
  const ext: extensions = extension(file.mimetype)

  if (!AllowedImageFileFormats.includes(ext)) {
    return callback(
      new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedInvalidFileFormat,
        HttpStatus.BAD_REQUEST,
      ),
      false,
    )
  }

  return callback(null, true)
}

export const videoFileFilter = (req: Request, file: any, callback) => {
  const ext: extensions = extension(file.mimetype)

  if (!AllowedVideoFileFormats.includes(ext)) {
    return callback(
      new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedInvalidFileFormat,
        HttpStatus.BAD_REQUEST,
      ),
      false,
    )
  }

  return callback(null, true)
}
