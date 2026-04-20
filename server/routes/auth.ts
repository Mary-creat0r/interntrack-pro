import 'dotenv/config';
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma'

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET! as string;

//POST /api/auth/register
//Creates a new user account and returns a JWT token
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
//check for duplicate email before attempting to create
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            res.status(409).json({
                error: 'An account with this email already exists'
            });
            return;
        }
        //Hash the password - never store plain text passwords
        //bcrypt automatically generates and embeds a unique salt
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create the user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        //Sign a JWT containing userId and email
        //7d expiry balances security(limits exposure) with usability

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        //Return token but never the password hash
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
//verifies credentials and returns a JWT token
router.post('/login', async (req: Request, res: Response) => {
    console.log('LOGIN ROUTE HIT') // ← add this as first line
    console.log('Request body:', JSON.stringify(req.body))
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

        //Return the same error message whether the user doesn't exist or
        //the password is wrong - prevents user enumeration attacks

        if (!user) {
            res.status(401).json({
                error: 'Invalid email or password'
            });
            return;
        }

        //bcrypt.compare re-hashes the supplied password with the stored salt
        // and checks if the results match - never decrypts the stored hash
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

        const responseData = {
            message: 'Account login successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }

        console.log('Login response being sent:', responseData)
        res.status(200).json({
            message: 'Account login successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
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
