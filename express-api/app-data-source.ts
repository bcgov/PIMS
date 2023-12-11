import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env') });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: Number(parseInt(process.env.DATABASEPORT)),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  migrationsRun: false,
  logging: true,
  entities: ["./typeorm/entity/*.ts"],
  migrations: ["./typeorm/migrations/seed/*.ts", "./typeorm/migrations/*.ts"],
  subscribers: [],
});
