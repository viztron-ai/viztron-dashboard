'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { signUp } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Box,
  Button,
  FormHelperText,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
import TextField from '../ui/TextField';
import { Role, RoleWithLocation } from '@/types';
import { DeleteIcon } from 'lucide-react';
import { getRoles } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/client';
import Select from '../ui/Select';
import FormProvider from '../hook-forms/FormProvider';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFTextField from '../hook-forms/RHFInputFiled';
import { nanoid } from 'nanoid';
import { red } from '@/theme/themePrimitives';

// Define prop type with allowEmail boolean
interface SignUpProps {
  redirectMethod: string;
}

export default function SignUp({ redirectMethod }: SignUpProps) {
  const supabase = createClient();
  const router = redirectMethod === 'client' ? useRouter() : null;
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  // const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  // const [selectedRoles, setSelectedRoles] = useState<RoleWithLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const SignupSchema = Yup.object().shape({
    // first_name: Yup.string().required('First name is required'),
    // last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email().required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long')
      .matches(/[A-Z]/, 'Password must have at least one uppercase letter')
      .matches(/[a-z]/, 'Password must have at least one lowercase letter')
      .matches(/[0-9]/, 'Password must have at least one number')
      .matches(/[\W_]/, 'Password must have at least one special character')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required')
    // selectedRoles: Yup.array().min(1, 'One role is required')
  });

  // useEffect(() => {
  //   const fetchRoles = async () => {
  //     const roles = await getRoles(supabase);
  //     setAvailableRoles(roles);
  //   };

  //   fetchRoles();
  // }, []);

  const handleUserSignup = async (data) => {
    console.log('Line----79 Signup.tsx', data);
    // e.preventDefault();

    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    // formData.append('selectedRoles', JSON.stringify(selectedRoles));
    // formData.append('first_name', firstName);
    // formData.append('last_name', lastName);
    setIsLoading(true); // Disable the button while the request is being handled
    await handleRequest(formData, signUp, router);
    setIsLoading(false);
  };

  // const addRoleWithLocation = (roleWithLocation: RoleWithLocation) => {
  //   setSelectedRoles((prev) => [...prev, roleWithLocation]);
  // };

  // const removeRoleWithLocation = (index: number) => {
  //   setSelectedRoles((prev) => prev.filter((_, i) => i !== index));
  // };

  const defaultValues = {
    email: '',
    password: '',
    confirmPassword: ''
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema) as any
  });

  const { handleSubmit } = methods;

  return (
    <Stack direction={'column'} gap={1}>
      <FormProvider methods={methods} onSubmit={handleSubmit(handleUserSignup)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
            mb: 2
          }}
        >
          {/* <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
            <RHFTextField
              name="first_name"
              id="first_name"
              label={'First Name'}
              placeholder="John"
              fullWidth
            />
            <RHFTextField
              name="last_name"
              id="last_name"
              label={'Last Name'}
              placeholder="Luka"
              fullWidth
            />
          </Stack> */}
          <RHFTextField
            name="email"
            id="email"
            label={'Email'}
            placeholder="your@email.com"
            autoComplete="email"
          />

          <RHFTextField
            id="password"
            label={'Password'}
            name="password"
            placeholder="••••••"
            type="password"
          />

          <RHFTextField
            id="confirmPassword"
            label={'Confirm Password'}
            name="confirmPassword"
            placeholder="••••••"
            type="password"
          />

          {/* <Stack gap={2}>
            <Typography variant="h6" component="h3">
              Typography Roles and Locations
            </Typography>
            {errors?.selectedRoles && <FormHelperText sx={{color: red[500]}}>{errors.selectedRoles.message}</FormHelperText>}
            <TextField
              id="locationName"
              label={'Location Name'}
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Home, Office, etc."
            />
            <TextField
              id="locationAddress"
              label={'Location Address (Optional)'}
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              placeholder="123 Main St, City, Country"
            />
            <Button
              onClick={() => {
                setValue('selectedRoles', [
                  ...formValues.selectedRoles,
                  {
                    id: nanoid(7),
                    role: 'primary_owner',
                    location: {
                      name: locationName.trim(),
                      address: locationAddress.trim() || null
                    }
                  }
                ]);
                setSelectedRole('');
                setLocationName('');
                setLocationAddress('');
              }}
              disabled={!locationName}
              className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Add Role to Location
            </Button>

            {formValues.selectedRoles.length > 0 && (
              <Stack mt={1} gap={1}>
                <Typography mt={1} component={'h4'} variant="subtitle2">
                  Selected Roles:
                </Typography>
                <List dense>
                  {formValues.selectedRoles.map((item) => (
                    <ListItem
                      key={`${item.id}`}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => {
                            setValue('selectedRoles', formValues.selectedRoles.filter(role => role.id !== item.id))
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={`${item.role} at ${item.location.name}`}
                        secondary={item.location.address}
                      />
                    </ListItem>
                  ))}
                </List>
              </Stack>
            )}
          </Stack> */}
        </Box>

        <Button type="submit" fullWidth variant="contained" loading={isLoading}>
          Register
        </Button>
      </FormProvider>
      <Link
        href="/dashboard/signin/forgot_password"
        className="font-medium text-zinc-950 dark:text-white text-sm"
      >
        Forgot your password?
      </Link>
      
      <Link
        href="/dashboard/signin/password_signin"
        className="font-medium text-sm dark:text-white"
      >
        Already have an account?
      </Link>
    </Stack>
  );
}
