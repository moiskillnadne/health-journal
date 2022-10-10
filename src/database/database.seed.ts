import { DataSource } from 'typeorm'

import { defaultDataSourceOptions } from './database.config'

const seedDataSourceOptions = {
  ...defaultDataSourceOptions,
  migrations: ['src/**/seeders/*.{ts,js}'],
  migrationsTableName: 'seeders_typeorm',
  migrationsRun: false,
}

export default new DataSource(seedDataSourceOptions)
