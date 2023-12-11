import { DataSource } from 'typeorm';

export const myDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  synchronize: true,
  migrationsRun: false,
  logging: true,
  entities: ['./typeorm/entity/*.ts'],
  migrations: ['./typeorm/migrations/seed/*.ts', './typeorm/migrations/*.ts'],
  subscribers: [],
});
