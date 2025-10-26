export interface UnnormalizedUser {
  name?: {
    first?: string | ""; 
    middle?: string | "";
    last?: string | "";
  };
  userName?: string | "";
  email: string;
  password: string;
  country: string | "";
  city: string | "";
  image?: {
    url?: string | "";
    alt?: string | "";
  };
}
