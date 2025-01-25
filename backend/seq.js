import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

const sequelize = new Sequelize({
    database: process.env.DATABASE,
    username: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: 'mysql'
    
})

export default sequelize;