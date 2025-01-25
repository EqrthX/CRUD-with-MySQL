import express from 'express'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../Models/user.model.js';
import Product from '../Models/products.model.js';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
import { UUIDV4, } from 'sequelize';
import {add_product, delete_product, login, signup, update_product, update_profile} from '../Controllers/user.controller.js';

dotenv.config();

const userRoter = express.Router();

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'] || req.headers['Authorization'];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: "Forbidden: Token is invalid" });
      }

      req.user = decoded;
      next();

    });
};

userRoter.post('/signup',[
    body('studentId')
        .notEmpty().withMessage('Student ID is required')
        .isNumeric().withMessage('Student ID is a number'),
    body('fname')
        .notEmpty().withMessage('First name is required')
        .isAlpha().withMessage('First name must contain only letter'),
    body('lname')
        .notEmpty().withMessage('Last name is required')
        .isAlpha().withMessage('Last name must contain only letter'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('studentYears')
        .notEmpty().withMessage('Student Years is required')
        .isInt({min:1, max:4}).withMessage('Student years must be between 1 and 4')
    ] ,
    signup
);

userRoter.post('/login',[
    body('studentId').notEmpty().withMessage('Student ID is required'),
    body('password').notEmpty().withMessage('Password is required')
], login)

userRoter.get('/homepage', verifyToken, async (req, res) => {

    const fetchProduct = await Product.findAll()

    res.json({
        message: "Access token ready to use website",
        data: fetchProduct
    })
});

userRoter.post('/update-profile',
    [   verifyToken,

        body('userId')
            .notEmpty().isInt().withMessage('User ID not found'),
        body('first_name')
            .notEmpty().withMessage('Firstn Name is required for update profile')
            .isAlpha().withMessage('First name must be contain only letter'),
        body('last_name')
            .notEmpty().withMessage('Last Name is required for update profile')
            .isAlpha().withMessage('Last name must be contain only letter')            
    ], update_profile)

userRoter.post('/add-product',
    [ verifyToken,

    body('productName').notEmpty().withMessage('Product name is required')
        .isLength({min: 3}).withMessage('Product name must be at least 3 characters'),

    body('price').notEmpty().withMessage('Price is required')
        .isFloat({min: 0}).withMessage('Price must be a positive number'),

    body('quantity').notEmpty().withMessage('Price is required')
        .isLength({min: 1}).withMessage('Price must be at least 1'),

    body('description').notEmpty().withMessage('Description is required'),

    body('category').notEmpty().withMessage('Category is required'),
    ], add_product)

userRoter.put('/update-product/:id', verifyToken, update_product)

userRoter.delete('/delete-product/:id', verifyToken, delete_product)

userRoter.post('/logout', verifyToken, async (req, res) => {

    try {

        const {userId} = req.body;
        const timestamp = Date.now();
        const date = new Date(timestamp);

        const options = {timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', second: '2-digit'}
        const thaiDate = new Intl.DateTimeFormat('th-TH', options).format(date);

        const user = await User.findByPk(userId);

        user.lastLogin = thaiDate;

        await user.save();

        res.clearCookie('token');

        return res.status(200).json({
            success: true,
            message: "Log out successfully"
        })
    } catch (error) {
        
    }

})


export default userRoter;