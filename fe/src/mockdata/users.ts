import type { User, Role } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@shopeeclone.com',
    roleId: 2,
    status: 'active',
  },
  {
    id: 'user-2',
    email: 'seller@shopeeclone.com',
    roleId: 3,
    status: 'active',
  },
  {
    id: 'user-3',
    email: 'buyer@shopeeclone.com',
    roleId: 4,
    status: 'active',
  },
];

export const mockRoles: Role[] = [
  {
    id: 1,
    name: 'Super Admin',
    permissions: { all: true },
  },
  {
    id: 2,
    name: 'Admin',
    permissions: { can_approve_product: true, can_manage_users: true },
  },
  {
    id: 3,
    name: 'Seller',
    permissions: { can_manage_own_shop: true },
  },
  {
    id: 4,
    name: 'Buyer',
    permissions: { can_buy: true, can_review: true },
  },
];
