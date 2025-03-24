import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export const getUser = cache(async (supabase: SupabaseClient) => {
  try {
    // Ensure supabase is properly initialized
    if (!supabase || !supabase.auth) {
      console.error('Supabase client is not properly initialized');
      return null;
    }
    
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error fetching user:', error.message);
      return null;
    }

    const { data: userDetails } = await supabase.from('users').select('*').eq('user_id', data.user.id).single()
    return { ...data.user, userDetails };
    
  } catch (error) {
    console.error('Unexpected error in getUser:', error);
    return null;
  }
});

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  try {
    // Ensure supabase is properly initialized
    if (!supabase) {
      console.error('Supabase client is not properly initialized');
      return null;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .single();
      
    if (error) {
      console.error('Error fetching user details:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error in getUserDetails:', error);
    return null;
  }
});

export const getRoles = cache(async (supabase: SupabaseClient) => {
  try {
    // Ensure supabase is properly initialized
    if (!supabase) {
      console.error('Supabase client is not properly initialized');
      return null;
    }
    
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('id');
      
    if (error) {
      console.error('Error fetching roles:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error in getRoles:', error);
    return null;
  }
});