import { config } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'

config()

export const defaultDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env['DATABASE_HOST'],
  port: parseInt(process.env['DATABASE_PORT']),
  username: process.env['DATABASE_USER'],
  password: process.env['POSTGRES_PASSWORD'],
  database: process.env['POSTGRES_DB'],
  entities: ['dist/database/entities/*.entity.{ts,js}'],
  migrations: ['dist/database/migrations/*.{ts,js}'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: Boolean(process.env['MIRGATIONS_RUN']) || false,
  synchronize: false,
}

const dataSource = new DataSource(defaultDataSourceOptions)

dataSource
  .initialize()
  .then(() => {
    console.info('Data Source has been initialized!')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err)
  })

export default dataSource
