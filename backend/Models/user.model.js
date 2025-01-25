import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../seq.js";

const User = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    studentId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }, 
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    studentYears: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    lastLogin: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    userType:{
        type: DataTypes.TEXT,
        defaultValue: "user"
    }
}, {timestamps: true});

sequelize.sync({force: false})
    .then(() => console.log('Table users created!'))
    .catch((err) => console.log('Created table error: ', err))

export default User;