'use client';

import { updatePassword } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Box, Button } from '@mui/material';
import TextField from '../ui/TextField';

interface UpdatePasswordProps {
  redirectMethod: string;
}

export default function UpdatePassword({
  redirectMethod
}: UpdatePasswordProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('password', password);
    formData.append('passwordConfirm', confirmPassword);

    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(formData, updatePassword, router);
    setIsSubmitting(false);
  };

  return (
    <div className="my-8">
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
          id="password"
          label={'Password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••"
          type="password"
        />

        <TextField
          id="confirmPassword"
          label={'Confirm Password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="••••••"
          type="password"
        />
        <Button
          fullWidth
          variant="contained"
          type="submit"
          loading={isSubmitting}
        >
          Update Password
        </Button>
      </Box>
    </div>
  );
}
