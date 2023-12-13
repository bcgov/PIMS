import { DataSource } from 'typeorm';
import { CustomWinstonLogger } from './typeorm/utilities/CustomWinstonLogger';

// test if we are in a continer or not. if false use localhost
const hostname = process.env.CONTAINERIZED ? process.env.SERVICE_NAME : 'localhost';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: hostname,
  port: Number(parseInt(process.env.DATABASEPORT)),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  migrationsRun: false,
  logging: true,
  logger: new CustomWinstonLogger(true),
  entities: ['./typeorm/entity/*.ts'],
  migrations: ['./typeorm/migrations/seed/*.ts', './typeorm/migrations/*.ts'],
  subscribers: [],
});
