import { getProjectRole, hasPermission } from '@/lib/auth';

describe('Auth Library', () => {
    describe('getProjectRole', () => {
        const mockProject = {
            ownerId: 'owner-id',
            members: [
                { userId: 'editor-id', role: 'editor' },
                { userId: 'viewer-id', role: 'viewer' }
            ]
        };

        it('should return "owner" for ownerId', () => {
            expect(getProjectRole(mockProject, 'owner-id')).toBe('owner');
        });

        it('should return "editor" for editor member', () => {
            expect(getProjectRole(mockProject, 'editor-id')).toBe('editor');
        });

        it('should return "none" for non-member', () => {
            expect(getProjectRole(mockProject, 'random-id')).toBe('none');
        });
    });

    describe('hasPermission', () => {
        it('should allow owner to VIEW, EDIT, ADMIN', () => {
            expect(hasPermission('owner', 'VIEW')).toBe(true);
            expect(hasPermission('owner', 'EDIT')).toBe(true);
            expect(hasPermission('owner', 'ADMIN')).toBe(true);
        });

        it('should allow editor to VIEW, EDIT but not ADMIN', () => {
            expect(hasPermission('editor', 'VIEW')).toBe(true);
            expect(hasPermission('editor', 'EDIT')).toBe(true);
            expect(hasPermission('editor', 'ADMIN')).toBe(false);
        });

        it('should allow viewer to VIEW but not EDIT/ADMIN', () => {
            expect(hasPermission('viewer', 'VIEW')).toBe(true);
            expect(hasPermission('viewer', 'EDIT')).toBe(false);
            expect(hasPermission('viewer', 'ADMIN')).toBe(false);
        });
    });
});
