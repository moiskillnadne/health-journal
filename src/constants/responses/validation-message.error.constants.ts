export enum ValidationToken {
  // Email messages
  EmailNotEmpty = 'Email should not be empty',
  InvalidEmail = 'Entered the non-email format value',

  // Username messages
  UsernameNotEmpty = 'Username should not be empty',

  // Password messages
  PasswordMinLenght = 'Password should have at least 8 symbols',
  InvalidPassword = 'Entered the invalid password',

  // First name messages
  FirstnameNotEmpty = 'First name should not be empty',
  FirstnameNotString = 'First name should be string',

  // Last name messages
  LastnameNotEmpty = 'Last name should not be empty',
  LastnameNotString = 'Last name should be string',

  // Secret token messages
  SecretNotEmpty = 'Secret token should not be empty',
  SecretNotString = 'Secret token should be string',

  // Validation code messages
  CodeNotEmpty = 'Code should not be empty',
  CodeNotString = 'Code should be string',

  // User id messages
  UserIdNotEmpty = 'User id should not be empty',

  // Refresh token
  RefreshTokenNotEmpty = 'Refresh token should not be empty',
}
