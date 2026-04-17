import 'dotenv/config';
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma'

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET! as string;

//POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
    try{
        const {name, email, password} = req.body;

        //validate required fields
        if (!name || !email || !password || !name.length) {
            res.status(400).json({
                error: 'Name, email and password are required'
            });
            return;
        }
//check if the email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            res.status(409).json({
                error: 'An account with this email already exists'
            });
            return;
        }
        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create the user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        //Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            error: 'Failed to create account'
        });
    }
});

//POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        //Validate required fields
        if (!email || !password) {
            res.status(400).json({
                error: 'Email and password are required'
            });
            return;
        }
        //Find User by email
        const user = await prisma.user.findUnique({
            where: {email}
        });

        if (!user) {
            res.status(401).json({
                error: 'Invalid email or password'
            });
            return;
        }

        //Compare password with hash
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            res.status(401).json({
                error: 'Invalid email or password'
            });
            return;
        }

        //Generate JWT token
        const token = jwt.sign(
            {userId: user.id, email: user.email},
            JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.status(200).json({
            message: 'Account login successfully',
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Failed to login'
        });
    }
});

export default router;
