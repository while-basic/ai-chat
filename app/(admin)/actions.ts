'use server';

import { promoteToAdmin } from '@/lib/db/queries';

export async function promoteUserToAdmin(email: string) {
  try {
    await promoteToAdmin(email);
    return { success: true };
  } catch (error) {
    console.error('Failed to promote user:', error);
    return { success: false, error: 'Failed to promote user' };
  }
} 