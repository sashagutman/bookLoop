import type { FunctionComponent } from "react";
import type { User } from "../../interfaces/users/User";
import "../../style/admin-panel/admin-user-confirm.css";

type Props = {
    user: User;
    open: boolean;
    onClose: () => void;
    disabled?: boolean;
};

const AdminUserConfirm: FunctionComponent<Props> = ({ user, open, onClose, disabled }) => {
    const fullName =
        [user?.name?.first, user?.name?.middle, user?.name?.last].filter(Boolean).join(" ") || "User";
    const role = user?.isAdmin ? "Admin" : "User";

    return (
        <div className={`user-confirm ${open ? "is-open" : ""}`} aria-hidden={!open}>

            <div className="uc-backdrop" onClick={onClose} />

            <div className="uc-dialog" role="presentation" onClick={onClose}>
                <section className="uc-card" role="dialog" aria-modal="true" aria-labelledby="uc-title" onClick={(e) => e.stopPropagation()}>
                    <div className="uc-header">
                        <h2 id="uc-title" className="uc-title">User</h2>
                        <span className={`uc-role ${user?.isAdmin ? "admin" : "user"}`}>{role}</span>
                    </div>

                    <div className="uc-body">
                        <div className="uc-avatar">
                            <img
                                src={user?.image?.url || "https://picsum.photos/200"}
                                alt={
                                    user?.image?.alt ||
                                    [user?.name?.first, user?.name?.last].filter(Boolean).join(" ") ||
                                    "User avatar"
                                }
                                loading="lazy"
                                decoding="async"
                            />
                        </div>

                        <div className="uc-info">
                            <div className="uc-row">
                                <span className="uc-label">Name</span>
                                <span className="uc-value">{fullName}</span>
                            </div>
                            <div className="uc-row">
                                <span className="uc-label">Email</span>
                                <span className="uc-value">{user?.email || "—"}</span>
                            </div>
                            <div className="uc-row">
                                <span className="uc-label">Location</span>
                                <span className="uc-value">{[user?.city, user?.country].filter(Boolean).join(", ") || "—"}</span>
                            </div>
                            <div className="uc-row">
                                <span className="uc-label">User ID</span>
                                <span className="uc-value mono">{user?._id || "—"}</span>
                            </div>
                            <div className="uc-row">
                                <span className="uc-label">Created</span>
                                <span className="uc-value">{String(user?.createdAt || "—")}</span>
                            </div>
                            <div className="uc-row">
                                <span className="uc-label">Updated</span>
                                <span className="uc-value">{String(user?.updatedAt || "—")}</span>
                            </div>
                        </div>
                    </div>

                    <div className="uc-actions">
                        <button className="uc-btn uc-btn-cancel" onClick={onClose} disabled={disabled}>
                            Close
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminUserConfirm;