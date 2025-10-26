import type { UnnormalizedUser } from "../../interfaces/users/UnnormalizedUser";
import type { User } from "../../interfaces/users/User";

export function normalizeUser(values: UnnormalizedUser): User {
  return {
    _id: "", 
    name: {
      first: values.name?.first ?? "",
      middle: values.name?.middle ?? "",
      last: values.name?.last ?? "",
    },
    image: {
      url: values.image?.url ?? "",
      alt: values.image?.alt ?? "",
    },
    email: values.email,
    password: values.password,
    country: values.country ?? "",
    city: values.city ?? "",
    loginAttempts: 0,
    lockUntil: null,
    isAdmin: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
