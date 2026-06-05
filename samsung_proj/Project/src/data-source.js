require('dotenv').config();
const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type:        'postgres',
  host:        process.env.DB_HOST,
  port:        parseInt(process.env.DB_PORT),
  username:    process.env.DB_USERNAME,
  password:    process.env.DB_PASSWORD,
  database:    process.env.DB_NAME,
  synchronize: true,
  logging: ['error'],
  entities: [
    require('./entities/User').UserSchema,
    require('./entities/History').HistorySchema,
    require('./entities/SensorHistory').SensorHistorySchema,
  ],
});

module.exports = { AppDataSource };