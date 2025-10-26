import { useEffect } from "react";

type EditConfirmModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  rightBadge?: string;             
  children: React.ReactNode;       
  footer?: React.ReactNode;    
};

export default function EditConfirmModal({
  open,
  title,
  onClose,
  rightBadge,
  children,
  footer,
}: EditConfirmModalProps) {
  // ESC для закрытия
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={`cm-root ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="cm-backdrop" onClick={onClose} />

      <div className="cm-dialog" role="presentation" onClick={onClose}>
        <section
          className="cm-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cm-title"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="cm-header">
            <h3 id="cm-title" className="cm-title">{title}</h3>
            {rightBadge && <span className="cm-badge">{rightBadge}</span>}
          </div>

          <div className="cm-body">
            {children}
          </div>

          <div className="cm-actions">
            {footer ?? (
              <button type="button" className="cm-btn cm-btn-ghost" onClick={onClose}>
                Close
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
