import type { FunctionComponent, ReactNode } from "react";
import type { User } from "../../interfaces/users/User";
import EditConfirmModal from "./common/EditConfirmModal";
import "../../style/admin-panel/admin-edit-confirm.css";

interface AdminUserEditConfirmProps {
  open: boolean;
  onClose: () => void;
  user?: User | null;
  form: ReactNode;        
  footer?: ReactNode;   
}

const AdminUserEditConfirm: FunctionComponent<AdminUserEditConfirmProps> = ({
  open,
  onClose,
  user,
  form,
  footer,
}) => {
  const fullName =
    [user?.name?.first, user?.name?.middle, user?.name?.last].filter(Boolean).join(" ") || "User";
  const role = user?.isAdmin ? "Admin" : "User";

  return (
    <EditConfirmModal open={open} onClose={onClose} title={`Edit Profile — ${fullName}`}
      rightBadge={role}
      footer={footer}>
      {/* {form} */}
      <div className="cm-form-scope">{form}</div>
    </EditConfirmModal>
  );
};

export default AdminUserEditConfirm;
