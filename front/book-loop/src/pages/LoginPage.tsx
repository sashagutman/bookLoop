import type { FunctionComponent } from "react";
import "../style/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { getToken, decodeToken } from "../services/tokenService";

type FormValues = { email: string; password: string };

function greet() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const LoginPage: FunctionComponent = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({ mode: "onSubmit" });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values);

      const token = getToken();
      const decoded = token ? decodeToken(token) : null;
      const msg = decoded?.isAdmin ? `${greet()}, librarian!` : `${greet()}, reader!`;

      toast.success(msg);
      navigate("/", { replace: true });
    } catch (e: any) {
      const status = e?.response?.status;
      const msg =
        status === 403
          ? "Account is locked for 1 hour due to multiple failed attempts."
          : "Email or password is incorrect.";

      toast.error(msg);
      setError("email", { type: "server", message: msg });
      setError("password", { type: "server", message: msg });
    }
  };

  return (
    <section className="auth-page section-bg">
      <div className="container">
        <div className="auth-card">
          <div className="auth-card_inner">
            <div className="auth-card_body">
              <h2 className="auth-title">Welcome Back to Book Loop</h2>
              <p className="auth-subtitle">Sign in to continue</p>

              <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-group">
                  <input
                    placeholder="Email address"
                    autoComplete="email"
                    type="email"
                    id="email"
                    className="form-input"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    })}
                    aria-invalid={!!errors.email || undefined}
                  />
                  {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>

                <div className="form-group">
                  <input
                    placeholder="Password"
                    autoComplete="current-password"
                    type="password"
                    id="password"
                    className="form-input"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                    aria-invalid={!!errors.password || undefined}
                  />
                  {errors.password && <p className="form-error">{errors.password.message}</p>}
                </div>

                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </div>

            <div className="auth-footer">
              <span>Don't have an account?</span>
              <Link to="/register">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
