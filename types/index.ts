import { User } from "@supabase/supabase-js"

// Role definition
export interface Role {
  id: number
  name: string
  description: string
}

// Location definition
export interface Location {
  name: string
  address?: string | null
}

// Location with associated roles
export interface LocationWithRoles extends Location {
  roles: string[]
}

// Role with location for registration
export interface RoleWithLocation {
  role: string
  location: Location
}

// User registration data
export interface UserRegistration {
  email: string
  password: string
  rolesWithLocations: RoleWithLocation[]
}

// JWT app_metadata structure
export interface AppMetadata {
  roles: string[]
  locations: Record<string, string[]>
  location_ids: Record<string, number[]>
}

// Supabase database type definitions
export type Database = {
  auth_management: {
    Tables: {
      roles: {
        Row: {
          id: number
          name: string
          description: string
        }
        Insert: {
          id?: number
          name: string
          description?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
        }
      }
      locations: {
        Row: {
          id: number
          name: string
          address: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          address?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          address?: string | null
          created_at?: string
        }
      }
      user_roles: {
        Row: {
          id: number
          user_id: string
          role_id: number
          location_id: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          role_id: number
          location_id: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          role_id?: number
          location_id?: number
          created_at?: string
        }
      }
    }
    Functions: {
      create_user_with_roles: {
        Args: {
          email: string
          password: string
          user_roles: {
            role: string
            location: string
            address?: string
          }[]
        }
        Returns: string
      }
      add_user_role: {
        Args: {
          user_id: string
          role_name: string
          location_name: string
          location_address?: string
        }
        Returns: boolean
      }
      remove_user_role: {
        Args: {
          user_id: string
          role_name: string
          location_name: string
          location_address?: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          role_name: string
          location_name?: string
        }
        Returns: boolean
      }
      get_user_roles: {
        Args: Record<string, never>
        Returns: {
          role_name: string
          location_name: string
          location_address: string | null
        }[]
      }
      get_locations_with_role: {
        Args: {
          role_name: string
        }
        Returns: {
          location_id: number
          location_name: string
          location_address: string | null
        }[]
      }
    }
  }
}

interface UserDetail {
  "id": string;
  "first_name": string;
  "last_name": string;
  "email": string;
  "phone_number": string;
  "password_hash": string;
  "address_full": string;
  "city": string;
  "state": string;
  "zip": string;
  "date_of_birth": string;
  "date_created": string;
  "date_updated": string;
  "user_id": string;
}

export type SupabaseUser = User & {
  userDetails: UserDetail | null
}