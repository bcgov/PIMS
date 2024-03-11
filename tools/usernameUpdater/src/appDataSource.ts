import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from './UserEntity';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
} = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: +(POSTGRES_PORT ?? '5432'),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  synchronize: false,
  migrationsRun: false,
  entities: [User],
  namingStrategy: new SnakeNamingStrategy(),
});
