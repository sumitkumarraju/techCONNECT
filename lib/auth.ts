import { JwtPayload } from "jsonwebtoken";
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


export function verifyToken(token: string): JwtPayload | null {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
        return decoded as JwtPayload;
    } catch (error) {
        return null;
    }
}
