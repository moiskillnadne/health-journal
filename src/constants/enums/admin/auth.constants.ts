export const failedLoginAttemptsLimit = 5
export const failedLoginAttemptsBlockPeriod = 60 * 20 // 20 min

export const FailedLoginAttemptsMail = {
  subject: 'Account is blocked',
  body: 'Someone tried to log into your account several times. If this was not you, someone may have tried to access your account without your permission. We have locked your account for 20 minutes for this reason.',
}
