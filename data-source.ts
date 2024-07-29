import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  migrationsTableName: 'migrations',
  migrations: ['migrations/*.ts'],
  logging: process.env.NODE_ENV !== 'production',
  entities: ['dist/**/*.entity{.ts,.js}'],
  dropSchema: false,
});
