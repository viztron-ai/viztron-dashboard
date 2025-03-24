'use client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ReactNode, useEffect } from 'react';
import theme from '../theme';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { useSearchParams } from 'next/navigation';
import { LocalizationProvider } from '@mui/x-date-pickers';
// If you are using date-fns v3.x or v4.x, please import the v3 adapter
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'

interface ProviderProps {
  children: ReactNode;
}

const ThemeChild = ({ children }: { children: ReactNode }) => {
  const params = useSearchParams();

  useEffect(() => {
    const error = params.get('error');
    const status = params.get('status')
    if (error) {
      const description = params.get('error_description')
      enqueueSnackbar(`${error} - ${description}`, {
        variant: 'error',
      });
    }

    if(status) {
      const description = params.get('status_description')
      enqueueSnackbar(`${status} - ${description}`, {
        variant: 'success',
      });
    }
  }, [params]);

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline enableColorScheme />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default function Provider({ children }: ProviderProps) {
  return (
    <SnackbarProvider
      autoHideDuration={4000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
    >
      <ThemeChild>{children}</ThemeChild>
    </SnackbarProvider>
  );
}
