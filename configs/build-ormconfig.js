/* eslint-disable @typescript-eslint/no-var-requires */
if (process.env['NODE_ENV'] !== 'production') {
  require('dotenv').config()
}

const { join } = require('path')
const { writeFileSync } = require('fs')

const isTest = process.argv[2] === 'test'
const rootDir = isTest ? 'src' : 'dist'

const ormConfig = {
  type: 'postgres',
  host: process.env['DATABASE_HOST'],
  port: parseInt(process.env['DATABASE_PORT']),
  username: process.env['DATABASE_USER'],
  password: process.env['POSTGRES_PASSWORD'],
  database: process.env['POSTGRES_DB'],
  entities: [join(rootDir, '**', 'entities', '*.entity.{ts,js}')],
  migrations: [join(rootDir, '**', 'migrations', '*.{ts,js}')],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: process.env['MIRGATIONS_RUN'] || false,
  cli: {
    migrationsDir: join('src', 'database', 'migrations'),
  },
  synchronize: false,
}

writeFileSync('ormconfig.json', JSON.stringify(ormConfig, null, 2))
