import type { FunctionComponent } from "react";
import { useEditProfile } from "../../hooks/useEditProfile"
import type { User } from "../../interfaces/users/User";
import "../../style/edit-profile.css";

type Props = {
  open: boolean;
  onClose: () => void;
  user: User;
  onUpdated: (u: User) => void;
};

const EditProfileModal: FunctionComponent<Props> = ({ open, onClose, user, onUpdated }) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    registerPwd,
    handleSubmitPwd,
    isSubmittingPwd,
    onSubmitProfile,
    onSubmitPassword,
  } = useEditProfile({ open, user, onClose, onUpdated });

  if (!open) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" onClick={(e) => e.stopPropagation()} >
        <div className="modal-header">
          <h3 id="edit-profile-title">Edit Profile</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit(onSubmitProfile)} noValidate>
          <div className="grid-2">
            <label>
              First name
              <input
                className={errors.first ? "input-error" : ""}
                placeholder="First name"
                {...register("first", { required: "First name is required" })}
              />
              {errors.first && <span className="field-error">{errors.first.message}</span>}
            </label>

            <label>
              Middle name (optional)
              <input placeholder="Middle name" {...register("middle")} />
            </label>

            <label>
              Last name
              <input
                className={errors.last ? "input-error" : ""}
                placeholder="Last name"
                {...register("last", { required: "Last name is required" })}
              />
              {errors.last && <span className="field-error">{errors.last.message}</span>}
            </label>

            <label>
              Email
              <input
                className={errors.email ? "input-error" : ""}
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                })}
              />
              {errors.email && <span className="field-error">{errors.email.message}</span>}
            </label>

            <label>
              Country
              <input
                className={errors.country ? "input-error" : ""}
                placeholder="Country"
                {...register("country", { required: "Country is required" })}
              />
              {errors.country && <span className="field-error">{errors.country.message}</span>}
            </label>

            <label>
              City
              <input
                className={errors.city ? "input-error" : ""}
                placeholder="City"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && <span className="field-error">{errors.city.message}</span>}
            </label>

            <label className="grid-span-2">
              Avatar URL (http/https)
              <input placeholder="https://…" {...register("imageUrl")} />
            </label>

            <label className="grid-span-2">
              Image alt (optional)
              <input placeholder="Alt text" {...register("imageAlt")} />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
        {/* Password Update Form */}
        <form className="modal-form" onSubmit={handleSubmitPwd(onSubmitPassword)} noValidate>
          <label className="grid-span-2">
            New password
            <input
              type="password"
              placeholder="New password"
              {...registerPwd("newPassword", { required: "Password is required" })}
            />
          </label>

          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={isSubmittingPwd}>
              {isSubmittingPwd ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfileModal;
