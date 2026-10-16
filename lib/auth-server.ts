import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export const getDataFromToken = (req: NextRequest) => {
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) return null;

        // Use type assertion to silence the any warning while fixing the duplicate code
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret') as { id: string };
        return decoded.id;
    } catch (error: unknown) {
        return null;
    }
}
