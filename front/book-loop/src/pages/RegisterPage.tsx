import type { FunctionComponent } from "react";
import "../style/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { registerInitialValues, registerSchema } from "../validation/registerFormConfig";

const RegisterPage: FunctionComponent = () => {
  const nav = useNavigate();

  return (
    <section className="auth-page section-bg">
      <div className="container">
        <div className="auth-card register-card">
          <div className="auth-card_inner">
            <div className="auth-card_body">
              <h2 className="auth-title">Create your Book Loop account</h2>
              <Formik
                initialValues={registerInitialValues}
                validationSchema={registerSchema}

                onSubmit={async (values, { setSubmitting, setStatus }) => {
                  setStatus(undefined);
                  try {
                    const payload: any = {
                      name: {
                        first: values.first.trim(),
                        ...(values.middle ? { middle: values.middle.trim() } : {}),
                        ...(values.last ? { last: values.last.trim() } : {}),
                      },
                      email: values.email.toLowerCase().trim(),
                      password: values.password,
                      country: values.country.trim(),
                      city: values.city.trim(),
                    };
                    if (values.imageUrl) {
                      payload.image = {
                        url: values.imageUrl.trim(),
                        ...(values.imageAlt ? { alt: values.imageAlt.trim() } : {}),
                      };
                    }
                    await registerUser(payload);
                    nav("/login");
                  } catch (e: any) {
                    const msg =
                      e?.response?.data?.message ||
                      e?.response?.data ||
                      e?.message ||
                      "Registration failed";
                    setStatus(msg);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, isValid, dirty, status, touched, errors }) => (
                  <Form className="auth-form" noValidate>
                    <div className="form-row-3">
                      <div className="form-group">
                        <Field
                          name="first"
                          type="text"
                          placeholder="First name"
                          className={"form-input" + (touched.first && errors.first ? " input-error" : "")}
                        />
                        <ErrorMessage name="first" component="div" className="field-error" />
                      </div>

                      <div className="form-group">
                        <Field
                          name="middle"
                          type="text"
                          placeholder="Middle name (optional)"
                          className="form-input"
                        />
                        <ErrorMessage name="middle" component="div" className="field-error" />
                      </div>

                      <div className="form-group">
                        <Field
                          name="last"
                          type="text"
                          placeholder="Last name"
                          className={"form-input" + (touched.last && errors.last ? " input-error" : "")}
                          required
                        />
                        <ErrorMessage name="last" component="div" className="field-error" />
                      </div>
                    </div>

                    <div className="form-group">
                      <Field
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Email address"
                        className={"form-input" + (touched.email && errors.email ? " input-error" : "")}
                      />
                      <ErrorMessage name="email" component="div" className="field-error" />
                    </div>

                    <div className="form-group">
                      <Field
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Password"
                        className={"form-input" + (touched.password && errors.password ? " input-error" : "")}
                      />
                      <ErrorMessage name="password" component="div" className="field-error" />
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <Field
                          name="imageUrl"
                          type="url"
                          placeholder="Avatar URL (http/https)"
                          className={"form-input" + (touched.imageUrl && errors.imageUrl ? " input-error" : "")}
                        />
                        <ErrorMessage name="imageUrl" component="div" className="field-error" />
                      </div>
                      <div className="form-group">
                        <Field
                          name="imageAlt"
                          type="text"
                          placeholder="Image alt (optional)"
                          className="form-input"
                        />
                        <ErrorMessage name="imageAlt" component="div" className="field-error" />
                      </div>
                    </div>
                    <div className="form-row-2">
                      <div className="form-group">
                        <Field
                          name="country"
                          type="text"
                          placeholder="Country"
                          className={"form-input" + (touched.country && errors.country ? " input-error" : "")}
                        />
                        <ErrorMessage name="country" component="div" className="field-error" />
                      </div>
                      <div className="form-group">
                        <Field
                          name="city"
                          type="text"
                          placeholder="City"
                          className={"form-input" + (touched.city && errors.city ? " input-error" : "")}
                        />
                        <ErrorMessage name="city" component="div" className="field-error" />
                      </div>
                    </div>

                    {!!status && <div className="form-error">{status}</div>}

                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={isSubmitting || !dirty || !isValid}
                    >
                      {isSubmitting ? "Signing up..." : "Sign Up"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>

            <div className="auth-footer">
              <span>Already have an account?</span>
              <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;