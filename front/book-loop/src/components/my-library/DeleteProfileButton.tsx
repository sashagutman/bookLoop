import type { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "sonner";

import { confirmDeleteUser } from "../../helpers/modals";
import { deleteMe, deleteUserById } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

interface DeleteProfileButtonProps {
  userId?: string;
  fullName: string;
  isMeRoute: boolean;
  disabled?: boolean;
  className?: string;
  titleWhenDisabled?: string;
  redirectTo?: string;
}

const DeleteProfileButton: FunctionComponent<DeleteProfileButtonProps> = ({
  userId,
  fullName,
  isMeRoute,
  disabled,
  className = "",
  titleWhenDisabled = "You do not have permission to delete",
  redirectTo = "/",
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleClick() {
    if (disabled) return;

    const ok = await confirmDeleteUser(fullName);
    if (!ok) return;

    try {
      if (isMeRoute) {
        await deleteMe();
        toast.success("Profile deleted");
        logout(); // убрать токен/стейт
      } else if (userId) {
        await deleteUserById(userId);
        toast.success("User deleted");
      }
      navigate(redirectTo, { replace: true });
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to delete profile";
      toast.error(msg);
    }
  }

  return (
    <button
      type="button"
      className={`btn-flip ${className}`}
      onClick={handleClick}
      disabled={disabled}
      title={disabled ? titleWhenDisabled : "Delete profile"}
      aria-disabled={disabled ? true : undefined}
    >
      <span className="front">Delete Profile</span>
      <span className="back" aria-hidden="true">
        <RiDeleteBin6Line />
      </span>
    </button>
  );
};

export default DeleteProfileButton;
