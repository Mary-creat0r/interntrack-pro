import 'dotenv/config';
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}

//Extend Express Request type to include user
export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

export function authenticateToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    // Pull the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            error: 'Access denied. No token provided.',
            hint: 'Set the Authorization header to: Bearer <your-token>'
        });
        return;
    }

    // Extract token after 'Bearer '
    const token = authHeader.split(' ')[1];

    //Verify the token
    try{
        const decoded = jwt.verify(token, JWT_SECRET) as unknown as {
            userId: number;
            email: string;
        };
        // Attach decoded payload to req
        req.user = decoded;
        next();

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: 'Token has expired. Please log in again.' });
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: 'Invalid token.' });
            return;
        }
        res.status(500).json({ error: 'Internal server error during authentication.' });
    }
}


