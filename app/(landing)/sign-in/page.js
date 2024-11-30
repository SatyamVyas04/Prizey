'use client';

import { useState } from 'react';
import { loginWithCreds, login } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LucideGithub, Mail, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await loginWithCreds({ email, password });
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/home');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image Section */}
      <div
        className="hidden bg-cover bg-center lg:block lg:w-1/2"
        style={{
          backgroundImage:
            'url("https://images.pexels.com/photos/64613/pexels-photo-64613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=3")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex h-full items-center justify-center bg-black/40">
          <div className="p-8 text-center text-white">
            <h1 className="mb-4 text-4xl font-bold">Welcome to Prizey</h1>
            <p className="text-xl">
              Track, save, and get alerts on product prices from your favorite
              retailers
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Section */}
      <div className="flex w-full items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Sign In</h2>
            <p className="text-muted-foreground">
              Connect to start tracking your favorite products
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="h-12"
              />
            </div>

            <Button type="submit" className="h-12 w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background/95 px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => login('github')}
              className="h-12 w-full hover:bg-secondary/80"
              variant="outline"
            >
              <LucideGithub className="mr-2 h-6 w-6" />
              Continue with GitHub
            </Button>

            <Button
              onClick={() => login('google')}
              className="h-12 w-full hover:bg-secondary/80"
              variant="outline"
            >
              <Mail className="mr-2 h-6 w-6" />
              Continue with Google
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Button
              variant="link"
              className="px-0 font-medium text-primary"
              onClick={() => router.push('/sign-up')}
            >
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
