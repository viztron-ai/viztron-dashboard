import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import {
  Button,
  Divider,
  Drawer,
  drawerClasses,
  Stack,
  Typography
} from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/contexts/layout';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Links from '@/components/sidebar/components/Links';
import { IRoute } from '@/types/types';

type SideMenuMobileProps = {
  open: boolean | undefined;
  toggleDrawer: () => void;
  routes: IRoute[];
};

const supabase = createClient();

export default function SideMenuMobile({
  open,
  toggleDrawer,
  routes
}: SideMenuMobileProps) {
  const user = useContext(UserContext);
  const router = useRouter();

  const handleLogout = () => {
    supabase.auth.signOut();
    router.push('/dashboard/signin');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%'
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            <Typography component="p" variant="h6">
              {user?.email}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1, px: 2, mt: 2 }}>
          <Links routes={routes} />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            onClick={() => handleLogout()}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
