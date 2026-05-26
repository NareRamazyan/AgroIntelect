require('dotenv').config(); // Պարտադիր կարդում ենք env-ը
const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [
        require("./entities/User").UserSchema,
        require("./entities/History").HistorySchema
    ]
});

module.exports = { AppDataSource };