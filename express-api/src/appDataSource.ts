import { DataSource } from 'typeorm';
import { CustomWinstonLogger } from '@/typeorm/utilities/CustomWinstonLogger';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import Entities from '@/typeorm/entitiesIndex';

dotenv.config({ path: resolve(__dirname, '../../.env') });

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
  synchronize: false,
  migrationsRun: true,
  logging: process.env.LOG_QUERIES === 'true',
  logger: process.env.RAW_TYPEORM_DEBUG === 'true' ? undefined : new CustomWinstonLogger(true),
  entities: Entities,
  migrations: [`src/typeorm/Migrations/*.{ts,js}`],
  subscribers: [],
  namingStrategy: new SnakeNamingStrategy(),
});
