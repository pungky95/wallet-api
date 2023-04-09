import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

const dbUrl = new URL(process.env.DATABASE_URL);
const routingId = dbUrl.searchParams.get('options');
dbUrl.searchParams.delete('options');

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: dbUrl.toString(),
  logging: true,
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
  useUTC: true,
  ssl: true,
  extra: {
    options: routingId,
  },
  uuidExtension: 'uuid-ossp',
});
