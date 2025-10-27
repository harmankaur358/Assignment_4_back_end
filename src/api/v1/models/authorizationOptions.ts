export type Role = "user" | "officer" | "manager";

export interface AuthorizationOptions {
  hasRole: Role[];      
  allowSameUser?: boolean;
}