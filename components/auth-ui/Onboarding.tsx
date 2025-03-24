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
import { useRouter } from 'next/navigation';
import FormProvider from '../hook-forms/FormProvider';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import RHFTextField from '../hook-forms/RHFInputFiled';
import { DeleteIcon } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Role, RoleWithLocation } from '@/types';
import { useState } from 'react';
import { red } from '@/theme/themePrimitives';
import { handleRequest } from '@/utils/auth-helpers/client';
import { completeOnboarding } from '@/utils/auth-helpers/server';

interface OnboardingProp {
  redirectMethod: string;
}

type FormValueProp = {
  first_name: string;
  last_name: string;
  selectedRoles: {
    id: string;
    role: 'primary_owner';
    location: {
      name: string;
      address: string | null;
    };
  }[];
};

export default function Onboarding({ redirectMethod }: OnboardingProp) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [locationName, setLocationName] = useState<string>('');
  const [locationAddress, setLocationAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const SignupSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    selectedRoles: Yup.array().min(1, 'One role is required')
  });

  const defaultValues = {
    first_name: '',
    last_name: '',
    selectedRoles: []
  };

  const methods = useForm<FormValueProp>({
    defaultValues,
    resolver: yupResolver(SignupSchema) as any
  });

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = methods;

  const formValues = watch();

  const handleUserRegister = async (data: FormValueProp) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('selectedRoles', JSON.stringify(data.selectedRoles));
    await handleRequest(formData, completeOnboarding, router);
    setIsLoading(false);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleUserRegister)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
          mb: 2
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
          <RHFTextField
            name="first_name"
            id="first_name"
            label={'First Name'}
            fullWidth
          />
          <RHFTextField
            name="last_name"
            id="last_name"
            label={'Last Name'}
            fullWidth
          />
        </Stack>

        <Stack gap={2}>
          <Box>
            <Typography variant="h6" component="h3">
              Typography Roles and Locations
            </Typography>
            {errors?.selectedRoles && (
              <FormHelperText sx={{ color: red[400] }}>
                {errors.selectedRoles.message}
              </FormHelperText>
            )}
          </Box>
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
                },
              ], {shouldValidate: false});
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
                          setValue(
                            'selectedRoles',
                            formValues.selectedRoles.filter(
                              (role) => role.id !== item.id
                            )
                          );
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
        </Stack>
      </Box>

      <Button type="submit" fullWidth variant="contained" loading={isLoading}>
        Complete Profile
      </Button>
    </FormProvider>
  );
}
