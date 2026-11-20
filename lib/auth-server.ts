import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string;
}

export const getDataFromToken = (req: NextRequest): string | null => {
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) return null;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret') as JwtPayload;
        return decoded.id;
    } catch (error: unknown) {
        return null;
    }
}
