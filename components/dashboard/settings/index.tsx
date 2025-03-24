/*eslint-disable*/
'use client';

import DashboardLayout from '@/components/layout';
import { Card } from '@/components/ui/card';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getURL, getStatusRedirect, getUserInitials } from '@/utils/helpers';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid2,
  Stack,
  Typography
} from '@mui/material';
import TextField from '@/components/ui/TextField';
import { CITY_NAMES, STATE_NAMES } from '@/utils/constant';
import FormProvider from '@/components/hook-forms/FormProvider';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import RHFTextField from '@/components/hook-forms/RHFInputFiled';
import RHFDatePicker from '@/components/hook-forms/RHFDatePicker';
import RHFSelect from '@/components/hook-forms/RHFSelect';
import { enqueueSnackbar } from 'notistack';
import { SupabaseUser } from '@/types';

interface Props {
  user: SupabaseUser | null | undefined;
  userDetails: { [x: string]: any } | null;
}

type FormValuesProps = {
  first_name: string;
  last_name: string;
  date_of_birth: Date | string;
  state: string;
  city: string;
  address_full: string;
  zip: string;
};

const supabase = createClient();
export default function Settings(props: Props) {
  const { user } = props;
  // Input States
  const [nameError, setNameError] = useState<{
    status: boolean;
    message: string;
  }>();

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const PersonalSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    date_of_birth: Yup.string(),
    state: Yup.string(),
    city: Yup.string(),
    address_full: Yup.string(),
    zip: Yup.string()
  });

  const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new email is the same as the old email
    if (e.currentTarget.newEmail.value === user.email) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    // Get form data
    const newEmail = e.currentTarget.newEmail.value.trim();

    const callbackUrl = getURL(
      getStatusRedirect(
        '/dashboard/settings',
        'Success!',
        `Your email has been updated.`
      )
    );
    e.preventDefault();
    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      {
        emailRedirectTo: callbackUrl
      }
    );
    router.push('/dashboard/settings');
    setIsSubmitting(false);
  };

  const handleSubmitName = async (data: FormValuesProps) => {
    setIsSubmitting(true);

    const { data: userData, error } = await supabase
      .from('users')
      .upsert({
        ...(user?.userDetails?.id && { id: user?.userDetails?.id }),
        ...data,
        email: user.email,
        user_id: user.id,
        ...(data.date_of_birth && {
          date_of_birth: new Date(data.date_of_birth).toISOString()
        })
      })
      .select('*')
      .single();

    setIsSubmitting(false);

    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      return;
    }

    console.log('Line----121 index.tsx', userData);
  };

  const defaultValues = useMemo(
    () => ({
      first_name: user?.userDetails?.first_name || '',
      last_name: user?.userDetails?.last_name || '',
      date_of_birth: user?.userDetails?.date_of_birth
        ? new Date(user?.userDetails?.date_of_birth)
        : '',
      state: user?.userDetails?.state || '',
      city: user?.userDetails?.city || '',
      address_full: user?.userDetails?.address_full || '',
      zip: user?.userDetails?.zip || ''
    }),
    [user]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(PersonalSchema) as any,
    defaultValues
  });

  const userName = user.userDetails
    ? `${user.userDetails.first_name} ${user.userDetails.last_name}`
    : user.email;

  const { handleSubmit } = methods;

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Account Settings"
      description="Profile settings."
    >
      <Stack
        position={'relative'}
        direction={'column'}
        gap={2}
        mx={'auto'}
        sx={{
          maxWidth: { xs: '100%', md: '80%' },
          width: 'max-content',
          pt: { md: 'unset', lg: '100px' },
          pb: { lg: '100px' }
        }}
      >
        <Card
          className={
            'h-min flex gap-2 items-center aligh-center max-w-full py-8 px-4 dark:border-zinc-800'
          }
        >
          <Avatar
            sx={{
              bgcolor: 'rgba(80, 70, 229, 0.9)',
              width: { xs: 40, md: 60 },
              height: { xs: 40, md: 60 }
            }}
          >
            {getUserInitials(userName)}
          </Avatar>
          <Box>
            <Typography sx={{ color: 'black' }} variant="h2" component={'h1'}>
              {userName}
            </Typography>
            <Typography sx={{ color: 'black' }} variant="subtitle2">
              {user.email}
            </Typography>
          </Box>
        </Card>
        <Card
          className={
            'mb-5 h-min max-w-full pt-8 pb-6 px-6 dark:border-zinc-800'
          }
        >
          <p className="text-xl font-extrabold text-zinc-950 dark:text-white md:text-3xl">
            Account Details
          </p>
          <p className="mb-6 mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400 md:mt-4 md:text-base">
            Here you can change your account information
          </p>

          <p
            className={`mb-5 px-2.5 text-red-500 md:px-9 ${
              nameError?.status ? 'block' : 'hidden'
            }`}
          >
            {nameError?.message}
          </p>

          <div className="mb-8 flex flex-col md:flex-row md:items-center md:gap-3">
            <form
              className="w-full"
              id="emailForm"
              onSubmit={(e) => handleSubmitEmail(e)}
            >
              <TextField
                name="newEmail"
                id="email"
                defaultValue={props.user.email ?? ''}
                placeholder="Please enter your full name"
                label={'Your Email (We will email you to verify the change)'}
                fullWidth
              />
            </form>
            <Button
              className="flex h-full max-h-full w-full items-center justify-center rounded-lg px-4 py-4 text-base md:ms-4 font-medium md:w-[300px]"
              type="submit"
              form="emailForm"
            >
              Update email
            </Button>
          </div>

          <Divider />
          <FormProvider
            methods={methods}
            onSubmit={handleSubmit(handleSubmitName)}
          >
            <Grid2 container spacing={1}>
              <Grid2 size={{ xs: 12, lg: 6 }}>
                <RHFTextField
                  name="first_name"
                  id="first_name"
                  placeholder="Please enter your first name"
                  label={'First name (30 characters maximum)'}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={{ xs: 12, lg: 6 }}>
                <RHFTextField
                  name="last_name"
                  id="last_name"
                  placeholder="Please enter your last name"
                  label={'Last name (30 characters maximum)'}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={{ xs: 12, lg: 6 }}>
                <RHFTextField
                  name="address_full"
                  id="address_full"
                  placeholder="Please enter you address"
                  label={'Address'}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={{ xs: 12, lg: 6 }}>
                <RHFDatePicker
                  name="date_of_birth"
                  label="Basic date picker"
                  fullWidth
                  maxDate={new Date()}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <RHFSelect
                  name="city"
                  options={CITY_NAMES.map((state) => ({
                    label: state,
                    value: state
                  }))}
                  label={'City'}
                  id="city"
                  fullWidth
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <RHFSelect
                  options={STATE_NAMES.map((state) => ({
                    label: state,
                    value: state
                  }))}
                  label={'State'}
                  id="state"
                  fullWidth
                  name="state"
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <RHFTextField
                  name="zip"
                  id="zip"
                  placeholder="000000"
                  label={'Zip Code'}
                  fullWidth
                  type="number"
                />
              </Grid2>
            </Grid2>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              Update
            </Button>
          </FormProvider>
        </Card>
      </Stack>
    </DashboardLayout>
  );
}
