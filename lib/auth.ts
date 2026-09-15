import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Shared Permission Logic
export const PERMISSIONS = {
    VIEW: ['owner', 'editor', 'viewer'],
    EDIT: ['owner', 'editor'],
    ADMIN: ['owner']
};

export function getProjectRole(project: any, userId: string): string {
    if (project.ownerId.toString() === userId) return 'owner';

    const member = project.members.find((m: any) => m.userId.toString() === userId);
    return member ? member.role : 'none';
}

export function hasPermission(role: string, requiredRole: 'VIEW' | 'EDIT' | 'ADMIN'): boolean {
    const allowedRoles = PERMISSIONS[requiredRole];
    return allowedRoles.includes(role);
}

export const getDataFromToken = (req: NextRequest) => {
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) return null;
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
        return decoded.id;
    } catch (error: any) {
        return null;
    }
};
