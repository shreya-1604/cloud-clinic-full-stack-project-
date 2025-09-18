'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'doctor' | 'patient'>('patient');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data?.user) {
        // Insert role into 'profiles'
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            full_name: '',
            role,
          },
        ]);
        if (profileError) {
          setErrorMsg('Sign up succeeded, but profile insert failed: ' + profileError.message);
        } else {
          alert('Sign up successful! Please check your email to confirm.');
        }
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        // Optional: fetch role from profile and redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user?.id)
          .single();

        if (profile?.role === 'doctor') {
          router.push('/dashboard/doctor');
        } else {
          router.push('/dashboard/patient');
        }
      }
    }

    setLoading(false);
  };

  return (
    <form
      className="space-y-4 mx-auto max-w-sm p-6 bg-white rounded shadow"
      onSubmit={handleAuth}
    >
      <h2 className="text-xl font-semibold">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

      <input
        required
        type="email"
        className="input input-bordered w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        required
        type="password"
        className="input input-bordered w-full"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {isSignUp && (
        <select
          className="select select-bordered w-full"
          value={role}
          onChange={(e) => setRole(e.target.value as 'doctor' | 'patient')}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
      )}

      <button className="btn btn-primary w-full" type="submit" disabled={loading}>
        {loading ? 'Loading...' : isSignUp ? 'Register' : 'Login'}
      </button>

      <p className="text-sm text-center">
        {isSignUp ? 'Already have an account?' : 'No account?'}{' '}
        <button
          type="button"
          className="text-blue-600 underline"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Sign in' : 'Sign up'}
        </button>
      </p>

      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
    </form>
  );
}
