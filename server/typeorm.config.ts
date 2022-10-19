import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'devroot',
  database: 'digital_shop',
  entities: ['dist/src/**/*.entity.js'],
};

export default config;
