import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../lib/auth';
import { isEmail, minLength } from '../lib/validators';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isEmail(email)) return setError('Invalid email format');
    if (!minLength(password, 8)) return setError('Password must be 8+ chars');

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      const safeFrom = ['/login', '/signup'].includes(from) ? '/' : from;
      navigate(safeFrom, { replace: true });
    } else {
      setError(res.message || 'Login failed');
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Log in</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col text-sm">
                <span className="mb-2">Email</span>
                <input
                  className="input bg-transparent border px-3 py-2 rounded-md"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="flex flex-col text-sm">
                <span className="mb-2">Password</span>
                <input
                  className="input bg-transparent border px-3 py-2 rounded-md"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              {error && <div className="text-destructive text-sm">{error}</div>}

              <CardFooter className="px-0 pt-0">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in…' : 'Log in'}
                </Button>
              </CardFooter>
              <div className="text-sm text-muted-foreground mt-2 text-center">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  state={{ from: (location.state as any)?.from || location.pathname }}
                  className="text-primary underline"
                >
                  Create an account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}