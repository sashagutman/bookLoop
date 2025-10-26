import type { FunctionComponent, ReactNode } from "react";
import EditConfirmModal from "./common/EditConfirmModal";

interface AdminBookEditConfirmProps {
  open: boolean;
  onClose: () => void;
  bookTitle?: string;
  form: ReactNode;       
  footer?: ReactNode;  
}

const AdminBookEditConfirm: FunctionComponent<AdminBookEditConfirmProps> = ({
  open,
  onClose,
  bookTitle,
  form,
  footer,
}) => {
  return (
    <EditConfirmModal
      open={open}
      onClose={onClose}
      title={`Edit Book${bookTitle ? ` — ${bookTitle}` : ""}`}
      rightBadge="Book"
      footer={footer}
    >
      {form}
    </EditConfirmModal>
  );
};

export default AdminBookEditConfirm;
