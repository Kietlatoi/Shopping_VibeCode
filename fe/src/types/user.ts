export interface User {
  id: string;
  email: string;
  roleId: number;
  status: 'active' | 'banned' | 'unverified';
}

export interface Role {
  id: number;
  name: string;
  permissions: Record<string, boolean>;
}
