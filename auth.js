import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/prisma/db';
import { saltHashPassword } from '@/lib/utils/helper';
import bcrypt from 'bcryptjs';

const options = {
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        // console.log(credentials);
        const email = credentials.email;
        const password = saltHashPassword(credentials.password);

        let user = await db.user.findUnique({
          where: { email },
        });

        if (!user) {
          await db.user.create({
            data: {
              email,
              password,
            },
          });
        } else {
          const isMatch = bcrypt.compareSync(
            credentials.password,
            user.password,
          );
          if (!isMatch) {
            return new Error('Invalid credentials');
          }
        }
        return user;
      },
    }),
  ],
};

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth(options);
