import cookieParser from 'cookie-parser';
import express from 'express';
import userRoter from './Routes/user.route.js';
import sequelize from './seq.js';

const app = express()

app.use(cookieParser());
app.use(express.json());

app.use('/auth/api/users/', userRoter);

sequelize.authenticate().then(() => {
    app.listen(3523, () => console.log('Server running ...'));
    console.log('Connection has been established successfully.');
}).catch((err) => {
    console.error('Unable to connect to the database: ', err);
})