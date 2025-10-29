export type Role = "user" | "officer" | "manager";

//Interface with Authorization options
export interface AuthorizationOptions {
  hasRole: Role[];      
  allowSameUser?: boolean;
}