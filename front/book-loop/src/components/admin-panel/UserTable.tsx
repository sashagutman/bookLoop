import type { FunctionComponent } from "react";
import Loading from "../Loading";
import AdminUserConfirm from "./AdminUserConfirm";
import AdminUserEditConfirm from "./AdminUserEditConfirm";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import { useEditUserForm } from "../../hooks/useEditUserForm";
import { safeLocaleDate, fullName } from "../../utils/users/userUtils";

const UserTable: FunctionComponent = () => {
  const {
    users, isLoading,
    viewId, setViewId, viewed,
    editId, setEditId, editingUser,
    deletingId, handleDelete, replaceUser,
  } = useAdminUsers();

  const {
    register, handleSubmit, onSubmit, errors: formErrors, isSaving, isSubmitting
  } = useEditUserForm(editingUser, replaceUser, () => setEditId(null));

  if (isLoading) {
    return (
      <section className="details-section section-bg">
        <div className="container"><Loading /></div>
      </section>
    );
  }

  return (
    <>
      <div id="admin-users" className="admin-section">
        <div className="section-head">
          <h2 className="table-title">Users</h2>
        </div>

        <div className="card table-card">
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th id="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{fullName(u)}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.isAdmin ? "badge-admin" : ""}`}>
                        {u.isAdmin ? "Admin" : "Member"}
                      </span>
                    </td>
                    <td>{safeLocaleDate(u.createdAt)}</td>
                    <td id="right">
                      <div className="actions">
                        <button className="btn btn-ghost"  type="button" onClick={() => setViewId(u._id!)}  aria-haspopup="dialog"  title="View">
                          View
                        </button>

                        <button className="btn btn-ghost"  type="button" onClick={() => setEditId(u._id!)}  aria-haspopup="dialog"  title="Edit">
                          Edit
                        </button>

                        <button className="btn btn-danger" type="button"  onClick={() => handleDelete(u)} disabled={deletingId === u._id}  title="Delete">
                          {deletingId === u._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", opacity: 0.7 }}>
                      No users
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Просмотр */}
      {viewed && (
        <AdminUserConfirm user={viewed} open={Boolean(viewId)} onClose={() => setViewId(null)} disabled={deletingId === viewed._id}/>
      )}

      {/* Редактирование */}
      {editingUser && (
        <AdminUserEditConfirm open={Boolean(editId)} onClose={() => setEditId(null)}  user={editingUser}  
        form={
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid-2">
                <label>
                  First name
                  <input className={formErrors.first ? "input-error" : ""} placeholder="First name"
                    {...register("first", { required: "First name is required" })}
                  />
                  {formErrors.first && <span className="field-error">{formErrors.first.message as string}</span>}
                </label>

                <label>
                  Middle name (optional)
                  <input placeholder="Middle name" {...register("middle")} />
                </label>

                <label>
                  Last name
                  <input className={formErrors.last ? "input-error" : ""} placeholder="Last name"
                    {...register("last", { required: "Last name is required" })}
                  />
                  {formErrors.last && <span className="field-error">{formErrors.last.message as string}</span>}
                </label>

                <label>
                  Email
                  <input  className={formErrors.email ? "input-error" : ""} type="email" placeholder="Email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                    })}
                  />
                  {formErrors.email && <span className="field-error">{formErrors.email.message as string}</span>}
                </label>

                <label>
                  Country
                  <input
                    className={formErrors.country ? "input-error" : ""}
                    placeholder="Country"
                    {...register("country", { required: "Country is required" })}
                  />
                  {formErrors.country && <span className="field-error">{formErrors.country.message as string}</span>}
                </label>

                <label>
                  City
                  <input
                    className={formErrors.city ? "input-error" : ""}
                    placeholder="City"
                    {...register("city", { required: "City is required" })}
                  />
                  {formErrors.city && <span className="field-error">{formErrors.city.message as string}</span>}
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

              <div className="cm-actions">
                <button
                  type="submit"
                  className="cm-btn cm-btn-primary"
                  disabled={isSaving || isSubmitting}
                >
                  {isSaving || isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          }
        />
      )}
    </>
  );
};

export default UserTable;
