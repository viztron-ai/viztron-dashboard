'use client';

import { signInWithPassword } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import TextField from '../ui/TextField';

// Define prop type with allowEmail boolean
interface PasswordSignInProps {
  redirectMethod: string;
}

export default function PasswordSignIn({
  redirectMethod
}: PasswordSignInProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    setIsLoading(true); // Disable the button while the request is being handled
    await handleRequest(formData, signInWithPassword, router);
    setIsLoading(false);
  };

  return (
    <div>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
          mb: 2
        }}
      >
        <TextField
          id="email"
          label={'Email'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
          required
        />
        <TextField
          id="password"
          label={'Password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="••••••"
          required
        />

        <Button type="submit" fullWidth variant="contained" loading={isLoading}>
          Sign In
        </Button>
      </Box>
      <p>
        <a
          href="/dashboard/signin/forgot_password"
          className="font-medium text-zinc-950 dark:text-white text-sm"
        >
          Forgot your password?
        </a>
      </p>
      {/* {allowEmail && (
        <p>
          <a
            href="/dashboard/signin/email_signin"
            className="font-medium text-zinc-950 dark:text-white text-sm"
          >
            Sign in via magic link
          </a>
        </p>
      )} */}
      <p>
        <a
          href="/dashboard/signin/signup"
          className="font-medium text-zinc-950 dark:text-white text-sm"
        >
          Don't have an account? Sign up
        </a>
      </p>
    </div>
  );
}
