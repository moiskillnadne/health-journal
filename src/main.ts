import { Environment } from './constants/config.constants'
import { LoggerService } from './core/logger/logger.service'
import { INestApplication, RequestMethod, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { i18nValidationErrorFactory, I18nValidationExceptionFilter } from 'nestjs-i18n'
import { NextFunction } from 'express'
import { ASYNC_STORAGE } from './constants/async-local-storage.constants'
import { v4 as uuidv4 } from 'uuid'
import * as bodyParser from 'body-parser'

import * as admin from 'firebase-admin'
import { ServiceAccount } from 'firebase-admin'

function getTraceMiddleware(app: INestApplication) {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestStorage = app.get(ASYNC_STORAGE)
    const traceId = req.headers['x-request-id'] || uuidv4()

    const store = new Map().set('traceId', traceId)
    requestStorage.run(store, () => {
      setImmediate(() => next())
    })
  }
}

async function setUpFirebase() {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: 'service_account',
      project_id: process.env[Environment.FirebaseProjectId],
      private_key_id: process.env[Environment.FirebasePrivateKeyId],
      private_key: process.env[Environment.FirebasePrivateKey].replace(/\\n/gm, '\n'),
      client_email: process.env[Environment.FirebaseClientEmail],
      client_id: process.env[Environment.FirebaseClientId],
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gos0h%40vitalop-wellness-test.iam.gserviceaccount.com',
    } as ServiceAccount),
  })
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.APP_PORT || 3000
  const globalPrefix = process.env.GLOBAL_PREFIX || 'api'

  app.useLogger(app.get(LoggerService))
  app.use(getTraceMiddleware(app))
  app.use(bodyParser.json({ limit: '200mb' }))

  await setUpFirebase()

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders: ['Content-Disposition'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })

  app.setGlobalPrefix(globalPrefix, {
    exclude: [
      { path: '/.well-known/apple-app-site-association', method: RequestMethod.GET },
      { path: '/.well-known/assetlinks.json', method: RequestMethod.GET },
    ],
  })

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('VitalOP Wellness API')
    .setDescription('VitalOP Wellness API Documentation')
    .setVersion('1.0')
    .addTag('VitalOP')
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('swagger', app, document)

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: i18nValidationErrorFactory,
    }),
  )

  app.useGlobalFilters(new I18nValidationExceptionFilter())
  await app.listen(port)
}
bootstrap()
