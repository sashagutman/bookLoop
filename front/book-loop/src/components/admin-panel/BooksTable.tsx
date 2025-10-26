import type { FunctionComponent } from "react";
import "../../style/admin-panel/user-book-table.css";

import Loading from "../Loading";
import AdminBookConfirm from "./AdminBookConfirm";
import AdminBookEditConfirm from "./AdminBookEditConfirm";
import EditBookForm from "../my-books/EditBookForm";
import BooksTableView from "./BooksTableView";

import { LANGUAGES } from "../../constants/languages";
import { GENRES } from "../../constants/genres";

import { useUsersMap } from "../../hooks/useUsersMap";
import { useAdminBooks } from "../../hooks/useAdminBooks";
import { useEditBookForm } from "../../hooks/useEditBookForm";

const BooksTable: FunctionComponent = () => {
  const { getOwnerName } = useUsersMap();

  const {
    books, isLoading,
    viewId, setViewId, viewed,
    editId, setEditId, editingBook,
    handleDelete, saveEditedBook,
  } = useAdminBooks();

  const {
    register,
    errors,
    handleSubmitRHF,
    onValid,
    isBusy,
  } = useEditBookForm(editingBook, saveEditedBook);

  if (isLoading) {
    return (
      <section className="details-section section-bg">
        <div className="container"><Loading /></div>
      </section>
    );
  }

  return (
    <>
      <div id="admin-books" className="admin-section">
        <div className="section-head">
          <h2 className="table-title">Books</h2>
        </div>

        <BooksTableView
          books={books}
          getOwnerName={getOwnerName}
          onView={setViewId}
          onEdit={setEditId}
          onDelete={handleDelete}
        />
      </div>

      {/* Просмотр */}
      {viewed && (
        <AdminBookConfirm
          open={Boolean(viewId)}
          onClose={() => setViewId(null)}
          book={viewed}
        />
      )}

      {/* Редактирование */}
      {editingBook && (
        <AdminBookEditConfirm
          open={Boolean(editId)}
          onClose={() => setEditId(null)}
          form={
            <EditBookForm
              LANGS={LANGUAGES}
              GENRES={GENRES}
              register={register}
              errors={errors}
              isSubmitting={isBusy}
              onSubmit={onValid}              
              handleSubmit={handleSubmitRHF} 
              onCancel={() => setEditId(null)}
            />
          }
        />
      )}
    </>
  );
};

export default BooksTable;
