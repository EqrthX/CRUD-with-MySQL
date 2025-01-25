import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../Models/user.model.js';
import Product from '../Models/products.model.js';
import { body, validationResult } from 'express-validator';

export const signup = async (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            error: errors.array()
        })
    }

    try {

        const {studentId, fname, lname, password, studentYears} = req.body;

        const exitsStudentId = await User.findOne({
            where: {studentId}
        });

        if(exitsStudentId) {
            return res.status(200).json({
                success: false,
                message: "Student Id is Already."
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        if(!hashPassword) {
            return res.status(404).json({
                success: false,
                message: "Hash password no complete"
            });
        }

        const user = await User.create({
            studentId,
            first_name: fname,
            last_name: lname,
            password: hashPassword,
            studentYears
        });

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "Creted user failed!"
            });
        }

        return res.status(201).json({
            success: true,
            user
        })

    } catch (error) {
        
        console.log('Somethings wrong!: ',error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

}

export const login = async (req, res) => {
    const errors = validationResult(req)
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()
        })
    }
    try {

        const {studentId, password} = req.body;

        if(!studentId || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            })
        }

        const findStudentId = await User.findOne({
            where: {studentId}
        });

        if(!findStudentId) {
            return res.status(404).json({
                success: false,
                message: "Student ID not found, Please sign up first"
            })
        }

        const checkPassword = await bcrypt.compare(password, findStudentId.password);

        if(!checkPassword) return res.status(400).json({
            success: false,
            message: "Password not correct"
        });

        const token = jwt.sign(
            {
                userId: findStudentId.id,
                studentId: findStudentId.studentId,
                firstname: findStudentId.first_name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000
        })

        return res.status(200).json({
            success: true,
            message: "Login successfully!",
            token
        });

    } catch (error) {
        console.log('Something wrong!');
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

export const update_profile = async (req, res) => {

        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: errors.array()
            })
        }

        try {

            const {userId, first_name, last_name} = req.body

            const user = await User.findByPk(userId);

            if(!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }

            user.first_name = first_name;
            user.last_name = last_name;
            await user.save();

            res.status(200).json({
                success: true,
                message: "Update profile successfully!"
            });
            
        } catch (error) {
            
            console.log('Something went wrong! ', error);
            res.status(500).json({
                success: false,
                message: "Server Error"
            })

    }
}

export const add_product = async (req, res) => {

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()
        })
    }

    try {

        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const {productName, price, quantity, description, category} = req.body
        
        const product = await Product.create({

            product_name: productName,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10),
            Description: description,
            category,
            created_by: userId,
            update_by: userId,
            status: 'available'
        });

        if(!product) {
            return res.status(400).json({
                success: false,
                message: "Add product error"
            })
        }

        res.status(201).json({
            success: true,
            message: "Product added successfully!"
        });


    } catch (error) {

        console.error('Error adding product:', error);
        res.status(500).json({ success: false, message: 'Server Error' });

    }

}

export const update_product = async (req, res) => {

    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provider"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const productId = req.params.id;

        const {productName, price, quantity, description} = req.body;

        const product = await Product.findByPk(productId);

        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        const updateProduct = await Product.update({
            product_name: productName || product.product_name,
            price: parseFloat(price) || product.price,
            quantity: parseInt(quantity, 10) || product.quantity,
            Description: description || product.Description,
            update_by: userId
        }, {
            where: {
                id: productId
            }
        })

        if(updateProduct[0] === 0) {
            return res.status(404).json({
                success: false,
                message: "Product update failed, no changes made"
            })
        }

        res.status(200).json({
            success: true,
            message: "Product update successfully",
            data: updateProduct
        })

    } catch (error) {

        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Server Error' });

    }
}

export const delete_product = async(req, res) => {

    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const productId = req.params.id;

        await Product.destroy({
            where: {
                id: productId
            }
        });

        res.status(200).json({
            success: false,
            message: "Delete product successfully"
        });

    } catch (error) {

        console.error('Error delete product:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
        
    }
}
