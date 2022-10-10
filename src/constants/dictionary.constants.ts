export const validationFile = `validation`

export enum DictionaryPathToken {
  // Common
  IsNotEmpty = `validation.NOT_EMPTY`,
  InvalidFormat = `validation.INVALID_FORMAT`,
  MinLength8 = `validation.MIN_LENGTH_8`,
  IsString = `validation.IS_STRING`,
  IsBool = 'validation.IS_BOOL',

  // Password
  PasswordNotEmpty = `validation.PASSWORD_NOT_EMPTY`,
  PasswordInvalidFormat = `validation.PASSWORD_INVALID_FORMAT`,
  PasswordMinLength = `validation.PASSWORD_MIN_LENGTH`,

  // Confirmation code
  CodeNotEmpty = `validation.CODE_NOT_EMPTY`,
  CodeIsString = `validation.CODE_IS_STRING`,

  // First and last names
  FirstNameNotEmpty = `validation.FIRST_NAME_NOT_EMPTY`,
  FirstNameIsString = `validation.FIRST_NAME_IS_STRING`,
  LastNameNotEmpty = `validation.LAST_NAME_NOT_EMPTY`,
  LastNameIsString = `validation.LAST_NAME_IS_STRING`,

  // User exist
  UserByEmailAndUsernameExist = 'error.USER_EXIST.BY_EMAIL_AND_USERNAME',
  UserByEmailExist = 'error.USER_EXIST.BY_EMAIL',
  UserByUsernameExist = 'error.USER_EXIST.BY_USERNAME',

  CodeInvalid = 'error.CODE.INVALID',

  EmailConfirmedSuccessfully = 'success.EMAIL_CONFIRMED',
  RefferalAddedSuccessfully = 'success.REFFERAL_ADDED',
  RestorePasswordEmailWasSentSuccessfully = 'success.RESTORE_PASSWORD_EMAIL_WAS_SENT',
  PasswordWasRestoredSuccessfully = 'success.PASSWORD_RESTORED',
  SignoutSuccessfully = 'success.SIGN_OUT',
  CreatedSuccessfully = 'success.SUCCESS_CREATE',
  UpdatedSuccessfully = 'success.SUCCESS_UPDATE',
  DeletedSuccessfully = 'success.SUCCESS_DELETE',
  UserLanguageUpdated = 'success.USER.LANGUAGE_UPDATED',
  UserMeasurementUpdated = 'success.USER.MEASUREMENT_UPDATED',
  UpdatedEmailConfirmed = 'success.USER.EMAIL_VERIFIED',
  PasswordChanged = 'success.USER.PASSWORD_CHANGED',
  SupportEmailSentSuccessfully = 'success.SUPPORT.EMAIL_SENT',

  // User not found
  UserInvalidCredentials = 'error.USER_NOT_FOUND.INVALID_CREDENTIALS',
  UserByUsernameNotFound = 'error.USER_NOT_FOUND.BY_USERNAME',
  UserByEmailNotFound = 'error.USER_NOT_FOUND.BY_EMAIL',
  UserByIdNotFound = 'error.USER_NOT_FOUND.BY_ID',

  UserNotConfirmed = 'error.USER_NOT_CONFIRMED',

  // User health data
  UserDataNotFound = 'error.USER_DATA.NOT_FOUND',

  // Procedure
  ProcedureNotFound = 'error.PROCEDURE.NOT_FOUND',

  // Procedure
  MedicationNotFound = 'error.MEDICATION.NOT_FOUND',

  // Appointment
  AppointmentNotFound = 'error.APPOINTMENT.NOT_FOUND',

  // Notification
  NotificationNotFound = 'error.NOTIFICATION.NOT_FOUND',

  // Admin panel
  AccessToAdminPanelDenied = 'error.ADMIN_PANEL.ACCESS_DENIED',
  AccessToAdminPanelDeniedInactiveUser = 'error.ADMIN_PANEL.INACTIVE_USER',

  // Admin panel - Storage
  InvalidOrderOptionFormat = 'validation.INVALID_ORDER_OPTION_FORMAT',
  InvalidOrderOptionFormatStorage = 'validation.INVALID_ORDER_OPTION_FORMAT_STORAGE',
  InvalidOrderOptionFormatAdminUsers = 'validation.INVALID_ORDER_OPTION_FORMAT_ADMIN_USERS',
  InvalidOrderOptionFormatGallery = 'validation.INVALID_ORDER_OPTION_FORMAT_GALLERY',
  InvalidOrderOptionFormatTrack = 'validation.INVALID_ORDER_OPTION_FORMAT_TRACK',

  UpdatedFailed = 'error.ACTIONS.UPDATE_FAILED',
  InternalServerError = 'error.COMMON.INTERNAL_SERVER',
  UnconfiredEmailLoginFailed = 'error.ACTIONS.LOGIN_UNCONFIRMED_EMAIL_FAILED',

  // Settings
  SettingsRemindersNotFound = 'error.SETTINGS.REMINDERS.NOT_FOUND',
  SettingsNotificationsNotFound = 'error.SETTINGS.NOTIFICATIONS.NOT_FOUND',
  EmailBodyMaxLength = 'validation.EMAIL_BODY_MAX_LENGTH',

  // Gallery
  GalleryVideoNotFound = 'error.GALLERY.VIDEO.NOT_FOUND',
  GalleryArticleNotFound = 'error.GALLERY.ARTICLE.NOT_FOUND',

  //Storage
  StorageItemNotFound = 'error.STORAGE.NOT_FOUND',
  StorageItemHasInvalidTypeToIncrementViewsCount = 'error.STORAGE.INCREMENT_VIEWS_COUNT.CONTENT_TYPE_NOT_AVAILABLE',
  StorageFailedIncrementViewsCount = 'error.STORAGE.INCREMENT_VIEWS_COUNT.FAILED_INCREMENT',

  // Health Record
  WeightWasAdded = 'success.HEALTH_RECORD.WEIGHT.SAVED',
  BloodSugarWasAdded = 'success.HEALTH_RECORD.BLOOD_SUGAR.SAVED',
  UserConditionWasAdded = 'success.HEALTH_RECORD.USER_CONDITION.SAVED',
  BloodPressureWasAdded = 'success.HEALTH_RECORD.BLOOD_PRESSURE.SAVED',
  LdlWasAdded = 'success.HEALTH_RECORD.LDL.SAVED',
  TriglycerideWasAdded = 'success.HEALTH_RECORD.TRIGLYCERIDE.SAVED',
  Hba1cWasAdded = 'success.HEALTH_RECORD.HBA1C.SAVED',
  StepsWasAdded = 'success.HEALTH_RECORD.STEPS.SAVED',

  EmailSent = 'success.EMAIL_SENT',

  SleepAdded = 'success.LIFESTYLE_TRACKER.SLEEP.SAVED',
  WaterSaved = 'success.LIFESTYLE_TRACKER.WATER.SAVED',

  LinkExpired = 'error.LINK_EXPIRED',
  AttemptLimit = 'error.ATTEMPT_LIMIT',

  ShareUserDataFailed = 'error.SHARE.CANNOT_GET_USER_INFO',
  ShareTemplateCompileFailed = 'error.SHARE.TEMPLATE_COMPILE',

  CurrentPasswordIncorrect = 'error.CURRENT_PASSWORD_INCORRECT',
  ValueGreaterThanZero = 'validation.VALUE_SHOULD_BE_GREATER_THAN_ZERO',
  AdminUserTemporarilyBlockedFailedLoginAttempts = 'error.ADMIN_USER_TEMPORARILY_BLOCKED.FAILED_LOGIN_ATTEMPTS',
  MobileUserTemporarilyBlockedFailedLoginAttempts = 'error.MOBILE_USER_TEMPORARILY_BLOCKED.FAILED_LOGIN_ATTEMPTS',

  MobileUserTemporarilyBlockedFailedLoginAttemptsEmailSubject = 'email.MOBILE_USER_TEMPORARILY_BLOCKED.FAILED_LOGIN_ATTEMPTS.SUBJECT',
  MobileUserTemporarilyBlockedFailedLoginAttemptsEmailBody = 'email.MOBILE_USER_TEMPORARILY_BLOCKED.FAILED_LOGIN_ATTEMPTS.BODY',

  DevicesNotFound = 'error.DEVICE.NOT_FOUND',
  DeviceSaved = 'success.USER.DEVICE_SAVED',

  MailchimpAudienceMemberExist = 'error.MAILCHIMP.AUDIENCE.MEMBER_EXIST',
  RestoreUsernameExecutedSuccessfully = 'success.RESTORE_USERNAME_EXECUTED',
}
