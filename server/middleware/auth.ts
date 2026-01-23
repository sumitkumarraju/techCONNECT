import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized" });
    }

    try {
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET missing in env");
            return res.status(500).json({ message: "Server configuration error" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export default protect;
