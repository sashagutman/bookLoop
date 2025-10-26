import * as Yup from "yup";

export const registerInitialValues = {
  first: "",
  middle: "",
  last: "",
  email: "",
  password: "",
  imageUrl: "",
  imageAlt: "",
  country: "",
  city: "",
};
// validation schema using Yup
export const registerSchema = Yup.object({
  first: Yup.string().required("First name is required"),
  middle: Yup.string().optional(),
  last: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  imageUrl: Yup.string().url("Must be a valid URL").optional(),
  imageAlt: Yup.string().optional(),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
});
