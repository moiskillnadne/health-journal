export enum ErrorCodes {
  UserAlreadyExist = 'USER_ALREADY_EXIST',
  InvalidConfirmCode = 'INVALID_CONFIRM_CODE',
  InvalidUserCredentials = 'INVALID_USER_CREDENTIALS',
  AwsInternalError = 'AWS_INTERNAL_ERROR',
  MailchimpInternalError = 'MAILCHIMP_INTERNAL_ERROR',
  AwsS3InternalError = 'AWS_S3_INTERNAL_ERROR',
  FirebaseInternalError = 'FIREBASE_INTERNAL_ERROR',
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  FilesystemInternalError = 'FILESYSTEM_INTERNAL_ERROR',
  AttemptLimitExceeded = 'ATTEMPT_LIMIT_EXCEEDED',
  BadRequestError = 'BAD_REQUEST_ERROR',
  UserByIdNotFound = 'USER_BY_ID_NOT_FOUND',
  UserByEmailNotFound = 'USER_BY_EMAIL_NOT_FOUND',
  UserDataNotFound = 'USER_DATA_NOT_FOUND',
  ValidationFailed = 'VALIDATION_FAILED',
  AccessAdminDenied = 'ACCESS_ADMIN_DENIED',
  AdminUserTemporarilyBlocked = 'ADMIN_USER_TEMPORARILY_BLOCKED',
  MobileUserTemporarilyBlocked = 'MOBILE_USER_TEMPORARILY_BLOCKED',
  ValidationFailedInvalidFileFormat = 'VALIDATION_FAILED_INVALID_FILE_FORMAT',
  ValidationFailedDuplicateStorageFile = 'VALIDATION_FAILED_DUPLICATE_STORAGE_FILE',
  ValidationFailedDuplicateRequestFile = 'VALIDATION_FAILED_DUPLICATE_REQUEST_FILE',
  ValidationFailedNoFilesGiven = 'VALIDATION_FAILED_NO_FILES_GIVEN',
  ValidationFailedSomeEntitiesNotFound = 'VALIDATION_FAILED_SOME_ENTITIES_NOT_FOUND',
  ValidationFailedSRemoveTrackGroupsNotAllowed = 'VALIDATION_FAILED_REMOVE_TRACK_GROUPS_NOT_ALLOWED',
  ValidationFailedSomeEntitiesUnpublished = 'VALIDATION_FAILED_SOME_ENTITIES_UNPUBLISHED',
  ValidationFailedSomeStorageItemsPosted = 'VALIDATION_FAILED_SOME_STORAGE_ITEMS_POSTED',
  ValidationFailedSomeReplaceFilesPosted = 'VALIDATION_FAILED_SOME_REPLACE_FILES_POSTED',
  ValidationFailedAdminUserAlreadyActive = 'VALIDATION_FAILED_ADMIN_USER_ALREADY_ACTIVE',
  ValidationFailedAdminUserAlreadyInactive = 'VALIDATION_FAILED_ADMIN_USER_ALREADY_INACTIVE',
  ValidationFailedAdminUserCanNotChangeStatusForHimself = 'VALIDATION_FAILED_ADMIN_USER_CAN_NOT_CHANGE_STATUS_HIMSELF',
  ValidationFailedRelatedEntityNotFound = 'VALIDATION_FAILED_RELATED_ENTITY_NOT_FOUND',
  ValidationFailedInvalidStorageItemType = 'VALIDATION_FAILED_INVALID_STORAGE_ITEM_TYPE',
  ValidationFailedViewsCountSupportsOnlyVideoStorageItems = 'VALIDATION_FAILED_VIEWS_COUNT_SUPPORTS_ONLY_VIDEO_STORAGE_ITEMS',
  EntityNotFound = 'ENTITY_NOT_FOUND',
  NotUpdated = 'ENTITY_NOT_UPDATED',
  EmailNotVerified = 'EMAIL_NOT_VERIFIED',
  LinkExpired = 'LINK_EXPIRED',
  UserNotConfirmed = 'USER_NOT_CONFIRMED',
  PdfPreparationFailed = 'PDF_PREPARATION_FAILED',
  FailedCollectingAnalyticsDataError = 'FAILED_COLLECTING_ANALYTICS_DATA_ERROR',
  FailedCompressionAnalyticsDataError = 'FAILED_COMPRESSION_ANALYTICS_DATA_ERROR',
  CurrentPasswordIncorrect = 'CURRENT_PASSWORD_INCORRECT',
  DevicesNotFound = 'DEVICES_NOT_FOUND',
}
