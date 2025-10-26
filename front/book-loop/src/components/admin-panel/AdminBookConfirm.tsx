import type { FunctionComponent } from "react";
import type { Book } from "../../interfaces/books/Book";
import EditConfirmModal from "../admin-panel/common/EditConfirmModal";
import "../../style/admin-panel/admin-edit-confirm.css";
import "../../style/admin-panel/admin-book-confirm.css";
import { LANGUAGE_LABELS } from "../../helpers/languageLabels";

type Props = {
  open: boolean;
  onClose: () => void;
  book: Book;
};

const AdminBookConfirm: FunctionComponent<Props> = ({ open, onClose, book }) => {
  return (
    <EditConfirmModal
      open={open}
      onClose={onClose}
      title={`Book — ${book.title}`}
      rightBadge={book.genre}
      footer={
        <button type="button" className="cm-btn cm-btn-ghost" onClick={onClose}>
          Close
        </button>
      }
    >
      <article className="bookc">
        <div className="bookc-top">
          <div className="bookc-cover">
            <img
              src={book.image}
              alt={`${book.title} cover`}
              loading="lazy"
              decoding="async"
            />
          </div>

          <dl className="bookc-meta">
            <div className="bookc-row">
              <dt>Title</dt><dd>{book.title}</dd>
            </div>
            <div className="bookc-row">
              <dt>Author</dt><dd>{book.author}</dd>
            </div>
            <div className="bookc-row">
              <dt>Language</dt><dd>{LANGUAGE_LABELS[book.language] ?? book.language}</dd>
            </div>
            <div className="bookc-row">
              <dt>Genre</dt><dd>{book.genre}</dd>
            </div>
            <div className="bookc-row">
              <dt>Rating</dt><dd>{typeof book.rating === "number" ? book.rating : "—"}</dd>
            </div>
            <div className="bookc-row">
              <dt>Published</dt><dd>{book.publishedYear ?? "—"}</dd>
            </div>
            <div className="bookc-row">
              <dt>Read</dt><dd>{book.readYear ?? "—"}</dd>
            </div>
            <div className="bookc-row">
              <dt>Pages</dt><dd>{book.pages ?? "—"}</dd>
            </div>
          </dl>
        </div>

        {/* Описания */}
        {book.description && (
          <section className="bookc-block">
            <h4 className="bookc-block-title">Description</h4>
            <p className="bookc-text">{book.description}</p>
          </section>
        )}

        {book.notes && (
          <section className="bookc-block">
            <h4 className="bookc-block-title">Notes</h4>
            <p className="bookc-text">{book.notes}</p>
          </section>
        )}

        {/* Техническая информация */}
        <div className="bookc-footer">
          <div className="bookc-id">
            <span>Book ID:</span> <span className="mono">{book._id}</span>
          </div>
          <div className="bookc-id">
            <span>Owner:</span> <span className="mono">{book.user_id}</span>
          </div>
          <div className="bookc-inline">
            <span>Likes: {book.likes?.length ?? 0}</span>
            <span>Wants: {book.wants?.length ?? 0}</span>
          </div>
          <div className="bookc-inline">
            <span>Created: {new Date(book.createdAt).toLocaleDateString()}</span>
            <span>Updated: {new Date(book.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </article>
    </EditConfirmModal>
  );
};

export default AdminBookConfirm;
