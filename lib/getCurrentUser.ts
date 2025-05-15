import { headers } from 'next/headers';

export function getCurrentUser() {
  const headerList = headers();
  const userId = headerList.get('x-user-id');
  const email = headerList.get('x-user-email');
  const rol = headerList.get('x-user-rol');

  if (!userId || !email || !rol) return null;

  return {
    userId: parseInt(userId),
    email,
    rol,
  };
}
