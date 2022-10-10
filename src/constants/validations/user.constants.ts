export const PASSWORD_MIN_LENGTH = 8

export const passwordAvailableSymbolsRegExp = new RegExp(
  '^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\\d!@#$%^&*()\\-_=+\\\\|\\[\\]{};:/?.><]*)$',
)

const oneLowercase = '(?=.*[a-z])' // The string must contain at least 1 lowercase alphabetical character
const oneUppercase = '(?=.*[A-Z])' // The string must contain at least 1 uppercase alphabetical character
const oneNumber = '(?=.*[0-9])' // The string must contain at least 1 numeric character
// const oneSpecialCharacter = '(?=.*[!@#$%^&*])' // The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict

// Prev regexp (?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\\-_=+\\\\|\\[\\]{};:/?.><])
export const passwordRequiredRulesRegExp = new RegExp(`^${oneUppercase}${oneLowercase}${oneNumber}`)
