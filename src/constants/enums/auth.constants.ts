import { DictionaryPathToken } from '../dictionary.constants'

export const failedLoginAttemptsLimit = 5
export const failedLoginAttemptsBlockPeriod = 60 * 20 // 20 min

export const FailedLoginAttemptsMail = {
  subject: DictionaryPathToken.MobileUserTemporarilyBlockedFailedLoginAttemptsEmailSubject,
  body: DictionaryPathToken.MobileUserTemporarilyBlockedFailedLoginAttemptsEmailBody,
}
