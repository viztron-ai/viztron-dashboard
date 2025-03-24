'use client';

import {
  renderThumb,
  renderTrack,
  renderView
} from '@/components/scrollbar/Scrollbar';
import Links from '@/components/sidebar/components/Links';
import { IRoute } from '@/types/types';
import { useRouter } from 'next/navigation';
import React, { PropsWithChildren, useContext, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { HiX } from 'react-icons/hi';
import { HiBolt, HiOutlineCog6Tooth } from 'react-icons/hi2';
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import { UserContext, UserDetailsContext } from '@/contexts/layout';
import { createClient } from '@/utils/supabase/client';
import {
  Card,
  Drawer as MuiDrawer,
  drawerClasses,
  IconButton,
  styled,
  Divider,
  Box,
  Avatar,
  Tooltip,
  Button,
  Stack,
  Typography
} from '@mui/material';
import { getUserInitials } from '@/utils/helpers';

const supabase = createClient();

const drawerWidth = 300;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
    border: 0,
    overflow: 'inherit'
  }
});

// Custom styled menu component - replace the existing Links component with this
// This is just an example - you'll need to modify the actual Links component
const EnhancedLinks = ({ routes }) => {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState(null);

  // This is a placeholder - your actual implementation will depend on your routes structure
  return (
    <div className="space-y-1">
      {routes.map((route, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-xl transition-all duration-200 ease-in-out
            ${
              route.active
                ? 'bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 text-indigo-700 dark:text-indigo-400'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/40'
            }`}
          onMouseEnter={() => setHoveredItem(index)}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => router.push(route.path)}
        >
          {route.active && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-600 to-blue-500"></div>
          )}

          <div
            className={`flex items-center p-3 cursor-pointer ${route.active ? 'font-medium' : ''}`}
          >
            <div
              className={`mr-3 flex h-8 w-8 items-center justify-center rounded-lg
              ${
                route.active
                  ? 'bg-gradient-to-br from-indigo-600 to-blue-400 text-white shadow-md'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
              } transition-all duration-200`}
            >
              {route.icon}
            </div>
            <span>{route.name}</span>
          </div>

          {hoveredItem === index && !route.active && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export interface SidebarProps extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}

function Sidebar(props: SidebarProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;
  const { routes } = props;
  const [hover, setHover] = useState(false);
  const user = useContext(UserContext);

  const userName = user.userDetails
    ? `${user.userDetails.first_name} ${user.userDetails.last_name}`
    : user.email;

  const handleSignOut = async (e) => {
    e.preventDefault();
    supabase.auth.signOut();
    router.push('/dashboard/signin');
  };

  // SIDEBAR
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'fixed' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'transparent'
        },
        zIndex: { lg: 99 },
        transform: 'translateX(unset)',
        minHeight: '100%'
      }}
    >
      <Card
        sx={{ p: 0 }}
        className={`m-3 ml-3 h-[96.5vh] w-full overflow-hidden !rounded-lg border-zinc-200 pe-4 dark:border-zinc-800 sm:my-4 sm:mr-4 md:m-5 md:mr-[-50px]`}
      >
        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
          universal={true}
        >
          <Stack
            sx={{ height: '100%' }}
            direction={'column'}
            justifyContent={'space-between'}
          >
            <Stack direction={'column'}>
              <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'center'}
                gap={1}
                py={2}
              >
                <Stack
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    backgroundImage:
                      'linear-gradient(to bottom right, #4f46e5, #60a5fa)',
                    color: 'white',
                    boxShadow:
                      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    transitionProperty: 'transform',
                    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    animationDuration: '150ms'
                  }}
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <HiBolt className="h-6 w-6" />
                </Stack>
                <Typography
                  variant="h4"
                  component={'h2'}
                  sx={{ fontWeight: 700 }}
                >
                  Viztron AI
                </Typography>
              </Stack>
              <Divider className="my-4 opacity-50" />

              <Box className="px-4">
                {/* Replace with your actual menu component. If you can't modify the Links component,
                    you might need to style it using CSS instead */}
                <Links routes={routes} />
                {/* <EnhancedLinks routes={routes} /> */}
              </Box>
            </Stack>

            {/* User profile section with avatar */}
            <div className="mb-8 px-4">
              <Card
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  transform: hover ? 'translateY(-5px)' : 'none',
                  boxShadow: hover
                    ? '0 10px 30px -5px rgba(0, 0, 0, 0.1)'
                    : '0 2px 10px 0 rgba(0, 0, 0, 0.05)'
                }}
                className="w-full border border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80"
              >
                <div className="flex items-center space-x-3">
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(80, 70, 229, 0.9)',
                      width: 40,
                      height: 40
                    }}
                  >
                    {getUserInitials(userName)}
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-900 dark:text-white truncate max-w-[160px]">
                      {userName}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {user?.email
                        ? user.email.length > 20
                          ? `${user.email.substring(0, 17)}...`
                          : user.email
                        : 'User account'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <Tooltip title="Profile Settings">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => router.push('/dashboard/settings')}
                      sx={{
                        borderColor: 'rgba(99, 102, 241, 0.3)',
                        color: 'rgb(99, 102, 241)',
                        '&:hover': {
                          borderColor: 'rgba(99, 102, 241, 0.8)',
                          backgroundColor: 'rgba(99, 102, 241, 0.04)'
                        }
                      }}
                      className="flex-1 text-indigo-600 dark:text-indigo-400"
                      startIcon={<HiOutlineCog6Tooth className="h-4 w-4" />}
                    >
                      Settings
                    </Button>
                  </Tooltip>

                  <Box sx={{ width: '12px' }} />

                  <Tooltip title="Sign Out">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => handleSignOut(e)}
                      sx={{
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                        color: 'rgb(239, 68, 68)',
                        '&:hover': {
                          borderColor: 'rgba(239, 68, 68, 0.8)',
                          backgroundColor: 'rgba(239, 68, 68, 0.04)'
                        }
                      }}
                      className="flex-1 text-red-500 dark:text-red-400"
                      startIcon={
                        <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                      }
                    >
                      Logout
                    </Button>
                  </Tooltip>
                </div>
              </Card>
              {/* Version info */}
              <div className="mt-4 text-center">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Viztron Dashboard v1.0.0
                </span>
              </div>
            </div>
          </Stack>
        </Scrollbars>
      </Card>
    </Drawer>
  );
}

export default Sidebar;
