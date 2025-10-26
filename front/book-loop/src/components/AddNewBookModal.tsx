import type { FunctionComponent } from "react";
import "../style/modal-newbook.css";
import { MdClose } from "react-icons/md";
import { useAddBookForm } from "../hooks/useAddBookForm";

interface AddNewBookModalProps {
  open?: boolean;
  onClose: () => void;
}

const AddNewBookModal: FunctionComponent<AddNewBookModalProps> = ({ open, onClose }) => {
  const {
    form, onChange, isSubmitting, handleSubmit, handleCancel,
    languages, genres
  } = useAddBookForm(onClose);

  if (!open) return null;

  return (
    <>
      <div className="modal-overlay" />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="addBookTitle">
        <div className="modal-header">
          <h3 id="addBookTitle">Add New Book</h3>
          <button onClick={handleCancel} aria-label="Close" className="modal-close">
            <MdClose />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <div className="grid-2">
            <label>
              Title *
              <input name="title" type="text" placeholder="Book title" value={form.title}
                onChange={onChange}
                required />
            </label>

            <label>
              Author *
              <input name="author" type="text" placeholder="Book author" value={form.author}
                onChange={onChange}
                required />
            </label>

            <label>
              Language *
              <select name="language" value={form.language} onChange={onChange}
                required
                className={""}>
                <option value="" disabled>Select language</option>
                {languages.map((code) => (
                  <option key={code} value={code}>
                    {code === "en" ? "English"
                      : code === "ru" ? "Russian"
                      : code === "uk" ? "Ukrainian"
                      : code === "he" ? "Hebrew"
                      : code === "es" ? "Spanish"
                      : code === "de" ? "German"
                      : code === "fr" ? "French"
                      : code === "it" ? "Italian"
                      : code === "pl" ? "Polish"
                      : code === "pt" ? "Portuguese"
                      : code === "other" ? "Other"
                      : code}
                  </option>
                ))}
              </select>
            </label>

            {/* Genre → select с кодами */}
            <label>
              Genre *
              <select name="genre" value={form.genre}
                onChange={onChange}
                required >
                <option value="" disabled>Select genre</option>
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g.replace("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Published Year *
              <input name="publishedYear" type="number" placeholder="1940" value={form.publishedYear}
                onChange={onChange}
                required />
            </label>

            <label>
              Read Year
              <input name="readYear" type="number" placeholder="2021" value={form.readYear}
                onChange={onChange}/>
            </label>

            <label>
              Pages
              <input name="pages" type="number" placeholder="240" value={form.pages}
                onChange={onChange}/>
            </label>

            <label>
              Rating
              <input name="rating" type="number" min={0} max={5} step={1} placeholder="1-5"
                value={form.rating}
                onChange={onChange}/>
            </label>

            <label className="grid-span-2">
              Image URL
              <input name="image" type="url" placeholder="https://…" value={form.image}
                onChange={onChange} />
            </label>

            <label className="grid-span-2">
              Description
              <textarea name="description" rows={3} placeholder="Short description…"
                value={form.description}
                onChange={onChange}/>
            </label>

            <label className="grid-span-2">
              Notes
              <textarea name="notes" rows={3} placeholder="Your notes…"
                value={form.notes}
                onChange={onChange} />
            </label>
          </div>

          <div className="modal-actions">
            <button onClick={handleCancel} type="button" className="_btn btn-outline" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="_btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddNewBookModal;