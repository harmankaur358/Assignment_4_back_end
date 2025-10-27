export type UserRole = "user" | "officer" | "manager";

export interface AuthorizationOptions {
    roles: UserRole[];
    allowSameUser?: boolean;
}