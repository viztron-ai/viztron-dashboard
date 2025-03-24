// Auth Imports
import { IRoute } from '@/types/types';
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineCog8Tooth,
} from 'react-icons/hi2';

export const routes: IRoute[] = [
  {
    name: 'System Overview',
    path: '/dashboard/main',
    icon: <HiOutlineHome className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />,
    collapse: false
  },
  {
    name: 'Profile Settings',
    path: '/dashboard/settings',
    icon: (
      <HiOutlineCog8Tooth className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false
  },
  // {
  //   name: 'Users List',
  //   path: '/dashboard/users-list',
  //   icon: (
  //     <HiOutlineUsers className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
  //   ),
  //   collapse: false,
  // },
];
