'use client';

import { UserContext } from '@/contexts/layout';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { FiAlignJustify } from 'react-icons/fi';
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import { createClient } from '@/utils/supabase/client';
import { Avatar, IconButton, Stack } from '@mui/material';
import { getUserInitials } from '@/utils/helpers';

const supabase = createClient();
export default function HeaderLinks(props: {
  onShow: () => void;
  [x: string]: any;
}) {
  const { onShow } = props;
  const user = useContext(UserContext);
  // const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = getRedirectMethod() === 'client' ? useRouter() : null;

  const userName = user.userDetails ? `${user.userDetails.first_name} ${user.userDetails.last_name}` : user.email

  // Ensures this component is rendered only on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async (e) => {
    e.preventDefault();
    supabase.auth.signOut();
    router.push('/dashboard/signin');
  };
  if (!mounted) return null;
  return (
    <Stack
      direction={'row'}
      position={'relative'}
      alignItems={'center'}
      justifyContent={'space-around'}
      sx={{
        minWidth: 'max-content',
        maxWidth: 'max-content',
        gap: 1,
        px: { xs: 2, md: 2 },
        py: { md: 2 },
        pl: { md: 3 }
      }}
    >
      <IconButton onClick={onShow} sx={{ display: { md: 'none' } }}>
        <FiAlignJustify size={20} />
      </IconButton>

      <IconButton onClick={(e) => handleSignOut(e)}>
        <HiOutlineArrowRightOnRectangle size={18} />
      </IconButton>
      <a className="w-full" href="/dashboard/settings">
        <Avatar
          sx={{
            bgcolor: 'rgba(80, 70, 229, 0.9)',
            width: 40,
            height: 40
          }}
        >
          {getUserInitials(userName)}
        </Avatar>
      </a>
    </Stack>
  );
}
