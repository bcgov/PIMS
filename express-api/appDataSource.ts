import { DataSource } from 'typeorm';
import { CustomWinstonLogger } from './typeorm/utilities/CustomWinstonLogger';

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
  POSTGRES_SERVICE,
  CONTAINERIZED,
} = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: CONTAINERIZED ? POSTGRES_SERVICE : 'localhost', // If in a container, use the service name, else use localhost
  port: +(POSTGRES_PORT ?? '5432'),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  synchronize: true,
  migrationsRun: false,
  logging: true,
  logger: new CustomWinstonLogger(true),
  entities: ['./typeorm/entity/*.ts'],
  migrations: ['./typeorm/migrations/seed/*.ts', './typeorm/migrations/*.ts'],
  subscribers: [],
});
