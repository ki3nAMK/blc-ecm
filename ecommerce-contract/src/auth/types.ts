export type UserType = Record<string, any> | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession: () => Promise<void>;
  loginByMetamask: () => Promise<any>;
  signOut: () => Promise<any>
};
