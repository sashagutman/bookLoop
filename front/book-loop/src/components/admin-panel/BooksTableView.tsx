import type { FunctionComponent, ReactNode } from "react";
import type { Book } from "../../interfaces/books/Book";

type Props = {
  books: Book[];
  getOwnerName: (id?: string) => string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (book: Book) => void;
  footer?: ReactNode;
};

const BooksTableView: FunctionComponent<Props> = ({
  books, getOwnerName, onView, onEdit, onDelete, footer
}) => {
  return (
    <div className="card table-card">
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Owner</th>
              <th id="right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b._id}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{getOwnerName(b.user_id)}</td>
                <td id="right">
                  <div className="actions">
                    <button className="btn btn-ghost" type="button" onClick={() => onView(b._id)} aria-haspopup="dialog" title="View">
                      View
                    </button>
                    <button className="btn btn-ghost" type="button" onClick={() => onEdit(b._id)} aria-haspopup="dialog" title="Edit">
                      Edit
                    </button>
                    <button className="btn btn-danger" type="button" onClick={() => onDelete(b)} title="Delete">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>
                  No books
                </td>
              </tr>
            )}
          </tbody>
          {footer && <tfoot><tr><td colSpan={4}>{footer}</td></tr></tfoot>}
        </table>
      </div>
    </div>
  );
};

export default BooksTableView;
