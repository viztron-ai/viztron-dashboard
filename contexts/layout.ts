import { createContext } from 'react';
import { SupabaseUser } from '@/types';

interface OpenContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
type UserDetails = { [x: string]: any } | null;

export const OpenContext = createContext<OpenContextType>(undefined);
export const UserContext = createContext<SupabaseUser | undefined | null>(undefined);
export const UserDetailsContext = createContext<UserDetails | undefined | null>(
  undefined
);
