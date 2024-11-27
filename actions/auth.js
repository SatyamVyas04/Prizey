'use server';
import { signIn, signOut } from '@/auth';
import { db } from '@/prisma/db';
import { revalidatePath } from 'next/cache';
import { isRedirectError } from 'next/dist/client/components/redirect';

const getUserByEmail = async (email) => {
  try {
    const user = await db.user.findUnique({ where: email });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const login = async (provider) => {
  await signIn(provider, { redirectTo: '/home' });
  revalidatePath('/home');
};

export const logout = async () => {
  await signOut({ redirectTo: '/' });
  revalidatePath('/');
};

export const loginWithCreds = async (formData) => {
  const rawFormData = {
    email: formData.email,
    password: formData.password,
    redirectTo: '/home',
  };

  const existingUser = await getUserByEmail({ email: rawFormData.email });
  console.log(existingUser);

  try {
    const user = await signIn('credentials', rawFormData);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    revalidatePath('/home');
  }
};
