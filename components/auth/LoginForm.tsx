'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import useAuth from '../../hooks/useAuth';

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      await login(form);
      router.push('/dashboard');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-500">Email</label>
        <Input
          type="email"
          placeholder="example@gmail.com"
          value={form.email}
          onChange={(event) => handleChange('email', event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-500">Password</label>
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={form.password}
          onChange={(event) => handleChange('password', event.target.value)}
          iconRight={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          onIconClick={() => setShowPassword((prev) => !prev)}
          required
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <label className="flex items-center gap-2">
          <Checkbox
            checked={form.rememberMe}
            onChange={(event) => handleChange('rememberMe', event.target.checked)}
          />
          Remember me
        </label>
        <button type="button" className="text-orange-500 hover:text-orange-600">
          Forgot password?
        </button>
      </div>

      <Button className="w-full" type="submit" isLoading={loading}>
        Log in
      </Button>

      <p className="text-center text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <span className="font-semibold text-slate-700">Sign up</span>
      </p>
    </form>
  );
}
