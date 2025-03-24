'use client';

import { Box, Link, Stack, Typography } from '@mui/material';
import AdminNavbarLinks from './NavbarLinksAdmin';
import NavLink from '@/components/link/NavLink';
import { gray } from '@/theme/themePrimitives';
import { IRoute } from '@/types/types';
import SideMenuMobile from '../sidebar/MobileSidebar';
import { useEffect, useState } from 'react';

export default function AdminNavbar(props: {
  brandText: string;
  routes: IRoute[];
  [x: string]: any;
}) {
  const { brandText, routes } = props;
  const [showMenu, setShowMenu] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Stack
      component={'nav'}
      direction={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
      sx={{
        position: 'fixed',
        right: { xs: 12, md: 20 },
        top: { xs: 12, md: 20 },
        width: {
          xs: 'calc(100vw - 4%)',
          md: 'calc(100vw - 365px)',
          lg: 'calc(100vw - 365px)',
          xl: 'calc(100vw - 365px)'
        },
        borderRadius: 2,
        background: gray[50],
        py: 2,
        // backdropFilter: 'blur(20px)',
        transition: 'all',
        zIndex: 100
      }}
      className={scrolled 
        ? '!bg-gradient-to-r !from-white/90 !to-white/80 !backdrop-blur-md !shadow-[5px_5px_10px_rgba(0,0,0,0.05),-5px_-5px_10px_rgba(255,255,255,0.8)] dark:from-zinc-900/80 dark:to-zinc-800/75 dark:shadow-[5px_5px_10px_rgba(0,0,0,0.2),-5px_-5px_10px_rgba(30,30,30,0.1)]' 
        : '!bg-gradient-to-r !from-white/80 !to-white/70 !backdrop-blur-xl !shadow-[8px_8px_16px_rgba(0,0,0,0.05),-8px_-8px_16px_rgba(255,255,255,0.8)] dark:from-zinc-900/70 dark:to-zinc-800/60 dark:shadow-[8px_8px_16px_rgba(0,0,0,0.2),-8px_-8px_16px_rgba(30,30,30,0.1)]'
      }
    >
      <Box ml={2}>
        <Stack
          direction={'row'}
          sx={{
            mb: { xs: 0, md: 0.5 },
            pt: { md: 1 }
          }}
          alignItems={'center'}
        >
          <Link
            component={'a'}
            sx={{
              display: { xs: 'hidden', md: 'inline' },
              fontSize: 12,
              fontWeight: 400,
              ':hover': {
                textDecorationLine: 'underline'
              },
              '&::before': {
                display: 'none'
              },
            }}
            href=""
          >
            Pages
          </Link>
          <Typography
            variant="subtitle1"
            component={'span'}
            mx={0.5}
            sx={{ fontSize: 12 }}
          >
            {' '}
            /{' '}
          </Typography>
          <Link
            component={NavLink}
            sx={{
              fontSize: 12,
              fontWeight: 400,
              textTransform: 'capitalize',
              '&::before': {
                display: 'none'
              },
              ':hover': {
                textDecorationLine: 'underline'
              }
            }}
            href="#"
          >
            {brandText}
          </Link>
        </Stack>
        <Typography
          component="p"
          sx={{
            fontSize: { xs: 16, md: 24 },
            flexShrink: 1,
            textTransform: 'capitalize'
          }}
        >
          <Link
            component={NavLink}
            sx={{
              fontWeight: 600,
              textTransform: 'capitalize',
              '&::before': {
                display: 'none'
              },
              ':hover': {
                textDecorationLine: 'underline'
              }
            }}
            href="#"
          >
            {brandText}
          </Link>
        </Typography>
      </Box>
      <Box
        sx={{
          minWidth: 'max-content',
          ml: { md: 'auto' },
        }}
      >
        <AdminNavbarLinks onShow={() => setShowMenu(true)} />
      </Box>

      <SideMenuMobile open={showMenu} routes={routes} toggleDrawer={() => setShowMenu(false)} />
    </Stack>
  );
}