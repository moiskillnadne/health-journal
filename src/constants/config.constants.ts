export enum Environment {
  PasswordSalt = 'PASSWORD_HASH',

  CognitoClientId = 'COGNITO_CLIENT_ID',
  CognitoSecretHash = 'COGNITO_SECRET_HASH',
  CognitoRegion = 'COGNITO_REGION',
  CognitoPoolId = 'COGNITO_POOL_ID',

  CognitoClientIdAdmin = 'COGNITO_CLIENT_ID_ADMIN',
  CognitoPoolIdAdmin = 'COGNITO_POOL_ID_ADMIN',

  AwsAccessKey = 'AWS_ACCESS_KEY',
  AwsSecretAccesskey = 'AWS_SECRET_ACCESS_KEY',
  AwsSession = 'AWS_SESSION',

  WebAdminAccessToken = 'WEB_ADMIN_SECRET_ACCESS_TOKEN',

  S3Region = 'S3_REGION',
  S3Endpoint = 'S3_ENDPOINT',
  StorageS3BucketName = 'STORAGE_S3_BUCKET_NAME',

  SesRegion = 'SES_REGION',
  SesEndpoint = 'SES_ENDPOINT',
  SesSourceEmail = 'SES_SOURCE',
  SesToAddressEmail = 'SES_TO_ADDRESS',

  CloudWatchGroup = 'CLOUDWATCH_GROUP',
  CloudWatchStream = 'CLOUDWATCH_STREAM',

  MailChimpApiKey = 'MAILCHIMP_API_KEY',
  MailChimpServerPrefix = 'MAILCHIMP_SERVER_PREFIX',
  MailChimpDefaultAudienceId = 'MAILCHIMP_DEFAULT_AUDIENCE_ID',
  TmpDirPath = 'TMP_DIR_PATH',

  FirebaseProjectId = 'FIREBASE_PROJECT_ID',
  FirebasePrivateKeyId = 'FIREBASE_PRIVATE_KEY_ID',
  FirebasePrivateKey = 'FIREBASE_PRIVATE_KEY',
  FirebaseClientId = 'FIREBASE_CLIENT_ID',
  FirebaseClientEmail = 'FIREBASE_CLIENT_EMAIL',
}
