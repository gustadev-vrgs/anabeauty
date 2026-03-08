import { UserRole } from '@/types';

export type Permission =
  | 'clients:read'
  | 'clients:write'
  | 'services:read'
  | 'services:write'
  | 'appointments:read'
  | 'appointments:write'
  | 'timeBlocks:write'
  | 'users:manage';

const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    'clients:read',
    'clients:write',
    'services:read',
    'services:write',
    'appointments:read',
    'appointments:write',
    'timeBlocks:write',
    'users:manage',
  ],
  professional: ['clients:read', 'services:read', 'appointments:read', 'appointments:write'],
};

export function hasPermission(role: UserRole, permission: Permission) {
  return rolePermissions[role].includes(permission);
}
