import type { UnnormalizedUser } from "./UnnormalizedUser";
import type { User } from "./User";

export type CreateUserPayload = Pick<
  User, "name" | "image" | "email" | "password" | "country" | "city">;

export function normalizeUser(values: UnnormalizedUser): CreateUserPayload {
  return {
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
  };
}
