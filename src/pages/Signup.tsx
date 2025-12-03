import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { isEmail, minLength } from '../lib/validators';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Signup() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || '/';
    const { signup: signupAction } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!name.trim()) return setError('Enter your name');
        if (!isEmail(email)) return setError('Invalid email');
        if (!minLength(password, 8)) return setError('Password must be 8+ chars');
        if (password !== confirm) return setError('Passwords do not match');

        setLoading(true);
        const res = await signupAction(name, email, password);
        setLoading(false);
        if (res.success) {
            const safeFrom = ['/login', '/signup'].includes(from) ? '/' : from;
            navigate(safeFrom, { replace: true });
        } else {
            setError(res.message || 'Signup failed');
        }
    }

    return (
        <main className="container mx-auto px-4 py-12">
            <div className="max-w-lg mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Create account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="flex flex-col gap-4">
                            <label className="flex flex-col text-sm">
                                <span className="mb-2">Full name</span>
                                <input
                                    className="input bg-transparent border px-3 py-2 rounded-md"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </label>

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

                            <label className="flex flex-col text-sm">
                                <span className="mb-2">Confirm password</span>
                                <input
                                    className="input bg-transparent border px-3 py-2 rounded-md"
                                    type="password"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    required
                                />
                            </label>

                            {error && <div className="text-destructive text-sm">{error}</div>}

                            <CardFooter className="px-0 pt-0">
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Creating…' : 'Create account'}
                                </Button>
                            </CardFooter>
                            <div className="text-sm text-muted-foreground mt-2 text-center">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    state={{ from: (location.state as any)?.from || location.pathname }}
                                    className="text-primary underline"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}