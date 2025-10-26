export interface User {
  _id: string; 
  name: {
    first?: string;
    middle?: string;
    last?: string;
  };
  image: {
    url?: string;
    alt?: string;
  };
  email?: string;
  password?: string;
  country?: string;
  city?: string;
  loginAttempts?: number;
  lockUntil?: string | null; 
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}
