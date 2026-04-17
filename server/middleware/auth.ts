import 'dotenv/config';
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}

//Extend Express Request to include the decoded JWT payload
//This allows route handlers to access req.user.userId without casting
export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

//Middleware that protects routes by verifying the JWT token
//Attaches the decoded user payload to req.user for downstream handlers
export function authenticateToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    // Pull the Authorization header
    const authHeader = req.headers.authorization;

    //JWT must be sent as: Authorization: Bearer <token>
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            error: 'Access denied. No token provided.',
            hint: 'Set the Authorization header to: Bearer <your-token>'
        });
        return;
    }

    // Extract token string from the Bearer prefix
    const token = authHeader.split(' ')[1];

    //Verify signature and expiry - throws if invalid or expired
    try{
        const decoded = jwt.verify(token, JWT_SECRET) as unknown as {
            userId: number;
            email: string;
        };
        // Attach decoded payload so route handlers can access req.userId
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


