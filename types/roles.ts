// Enum for role types to ensure consistency across the application
export enum RoleType {
    PRIMARY_OWNER = 'primary_owner',
    OWNER_WITH_DEFENSE = 'owner_with_defense',
    OWNER_WITHOUT_DEFENSE = 'owner_without_defense',
    VIEWER = 'viewer',
    SYSTEM_ADMIN = 'system_admin'
  }
  
  // Role descriptions (for UI display)
  export const ROLE_DESCRIPTIONS: Record<RoleType, string> = {
    [RoleType.PRIMARY_OWNER]: 'Main account holder with full access',
    [RoleType.OWNER_WITH_DEFENSE]: 'Full privileges with defense capabilities',
    [RoleType.OWNER_WITHOUT_DEFENSE]: 'Full privileges except defense',
    [RoleType.VIEWER]: 'View-only access',
    [RoleType.SYSTEM_ADMIN]: 'Backend technical staff with full system access'
  };
  
  // Helper function to validate if a role is valid
  export function isValidRole(role: string): role is RoleType {
    return Object.values(RoleType).includes(role as RoleType);
  }