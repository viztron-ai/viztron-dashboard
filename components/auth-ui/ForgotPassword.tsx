'use client';

import Link from 'next/link';
import { requestPasswordUpdate } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Box, Button } from '@mui/material';
import TextField from '../ui/TextField';

// Define prop type with allowEmail boolean
interface ForgotPasswordProps {
  redirectMethod: string;
  disableButton?: boolean;
}

export default function ForgotPassword({
  redirectMethod
}: ForgotPasswordProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const pathname = usePathname()
  const [email, setEmail] = useState("");
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    setIsBtnLoading(true); // Disable the button while the request is being handled
    await handleRequest(formData, requestPasswordUpdate, router);
    setIsBtnLoading(false);
  };

  return (
    <div className="mb-8">
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

        <Button
          fullWidth
          variant="contained"
          type='submit'
          loading={isBtnLoading}
        >
          Send Email
        </Button>
      </Box>
      
      <p>
        <Link
          href="/dashboard/signin/password_signin"
          className="font-medium text-sm dark:text-white"
        >
          Sign in with email and password
        </Link>
      </p>
      <p>
        <Link
          href="/dashboard/signin/signup"
          className="font-medium text-sm dark:text-white"
        >
          Don't have an account? Sign up
        </Link>
      </p>
    </div>
  );
}
