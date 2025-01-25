import { DataTypes, UUIDV4 } from 'sequelize';
import sequelize from "../seq.js";

const Product = sequelize.define('products', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Date_of_addProduct: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'No description provided'
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('available', 'out_of_stock', 'discontinued'),
        defaultValue: 'available'
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    update_by: {
        type: DataTypes.INTEGER,
        allowNull: true 
    }
},{ timestamps: true})

sequelize.sync({force: false})
    .then(() => console.log('Table products created!'))
    .catch((err) => console.log('Creted table products error: ', err));

export default Product;