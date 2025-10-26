import type { FunctionComponent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { FiShare2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import "../style/shareButton.css";

type Action = {
  id: string;
  label: string;
  icon: ReactNode;
  onClick?: () => void | Promise<void>;
  to?: string;
  ariaLabel?: string;
};

interface ShareButtonProps {
  actions: Action[];
  className?: string;
}
  
const ShareButton: FunctionComponent<ShareButtonProps> = ({ actions, className }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={rootRef} className={`share-wrap ${open ? "open" : ""} ${className ?? ""}`}>
      <button
        type="button"
        className="share-trigger"
        aria-expanded={open}
        aria-label={open ? "Close actions" : "Open actions"}
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <FiShare2 className="share-icon" aria-hidden />
      </button>

      <div
        className="share-actions"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.preventDefault()}
      >
        {actions.map((a) =>
          a.to ? (
            <Link
              key={a.id}
              to={a.to}
              className="share-action-btn"
              aria-label={a.ariaLabel ?? a.label}
              title={a.label}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              {a.icon}
            </Link>
          ) : (
            <button
              key={a.id}
              type="button"
              className="share-action-btn"
              aria-label={a.ariaLabel ?? a.label}
              title={a.label}
              onClick={async (e) => {
                e.stopPropagation();
                try { await a.onClick?.(); }
                finally { setOpen(false); }
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {a.icon}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ShareButton;
