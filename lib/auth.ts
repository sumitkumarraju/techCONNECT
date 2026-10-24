// Shared Permission Logic

export interface AuthProjectMember {
    userId: string | { toString: () => string };
    role: string;
}

export interface AuthProject {
    ownerId: string | { toString: () => string };
    members: AuthProjectMember[];
}

export const PERMISSIONS = {
    VIEW: ['owner', 'editor', 'viewer'],
    EDIT: ['owner', 'editor'],
    ADMIN: ['owner']
};

export function getProjectRole(project: AuthProject, userId: string): string {
    if (project.ownerId.toString() === userId) return 'owner';

    const member = project.members.find((m: AuthProjectMember) => m.userId.toString() === userId);
    return member ? member.role : 'none';
}

export function hasPermission(role: string, requiredRole: 'VIEW' | 'EDIT' | 'ADMIN'): boolean {
    const allowedRoles = PERMISSIONS[requiredRole];
    return allowedRoles.includes(role);
}
