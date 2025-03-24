import Navbar from '@/components/navbar/NavbarAdmin';
import { routes } from '@/components/routes';
import Sidebar from '@/components/sidebar/Sidebar';
// import { Toaster } from '@/components/ui/toaster';
import { getActiveRoute } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import {
  OpenContext,
  UserContext,
  UserDetailsContext
} from '@/contexts/layout';
import React from 'react';
import { alpha, Box, Stack } from '@mui/material';
import { SupabaseUser } from '@/types';

interface Props {
  children: React.ReactNode;
  title: string;
  description: string;
  user: SupabaseUser | null | undefined;
  userDetails: SupabaseUser | null | undefined | any;
}

const DashboardLayout: React.FC<Props> = (props: Props) => {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <UserContext.Provider value={props.user}>
      <UserDetailsContext.Provider value={props.userDetails}>
        <OpenContext.Provider value={{ open, setOpen }}>
          <Stack
            direction={'row'}
            height={'100%'}
            width={'100%'}
            sx={{ background: 'white' }}
          >
            <Sidebar routes={routes} setOpen={setOpen} />
            <Box
              component="main"
              sx={(theme) => ({
                flexGrow: 1,
                // @ts-ignore
                backgroundColor: theme.vars
                  ? // @ts-ignore
                    `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                  : alpha(theme.palette.background.default, 1),
                overflow: 'auto',
                minHeight: '100vh'
              })}
            >
              <Box
                sx={{
                  mx: 'auto',
                  minHeight: '100vh',
                  p: { xs: 2, md: 3 },
                  pt: { xs: '100px', md: '140px' },
                  pl: { md: 6 }
                }}
              >
                {props.children}
              </Box>
              <Navbar
                routes={routes}
                brandText={getActiveRoute(routes, pathname)}
              />
            </Box>
          </Stack>
        </OpenContext.Provider>
      </UserDetailsContext.Provider>
    </UserContext.Provider>
  );
};

export default DashboardLayout;
