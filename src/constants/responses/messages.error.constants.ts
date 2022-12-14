export enum CustomResponse {
  Success = 'SUCCESS',
  Created = 'CREATED',
  NoContent = 'NO_CONTENT',
  BadRequest = 'BAD_REQUEST',
  Unauthorized = 'UNAUTHORIZED',
  Forbidden = 'FORBIDDEN',
  NotFound = 'NOT_FOUND',
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  BadGateway = 'BAD_GATEWAY',
  ValidationError = 'VALIDATION_ERROR',
}

export enum DictionaryErrorMessages {
  UserAlreadyExist = 'User already exist',
  UserWithEmailExist = 'User with email exist',
  UserWithUsernameExist = 'User with username exist',
  UserWithEmailAndUsernameExist = 'User with email and username exist',
  InternalServerError = 'Internal Server Error',
  InvalidConfirmCode = 'Invalid verification code provided',
  InvalidUserCredentials = 'The user with such credentials was not found',
  UsernameNotFound = 'The user with such username was not found',
  UserWithEmailNotFound = 'The user with such email was not found',
  UserByIdNotFound = 'The user by ID was not found',
  ValidationFailed = 'Validation failed',
  AccessAdminDenied = 'Access to the web admin panel denied',
  EntityNotFound = 'Entity not found',
  Forbidden = 'Access denied',
  TokenExpired = 'Code Expired',
  FirebaseInternalError = 'Firebase Internal Error',
}
