import type { FunctionComponent } from "react";
import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import type { BookForm } from "../../interfaces/forms/BookForm";
import type { Language } from "../../interfaces/Language";
import type { Genre } from "../../interfaces/Genre";

type Props = {
  LANGS: Record<Language, string>;
  GENRES: Record<Genre, string>;
  register: UseFormRegister<BookForm>;
  handleSubmit: UseFormHandleSubmit<BookForm>;
  errors: FieldErrors<BookForm>;
  isSubmitting: boolean;
  onSubmit: (values: BookForm) => Promise<boolean>;
  onCancel: () => void;
};

const EditBookForm: FunctionComponent<Props> = ({
  LANGS, GENRES, register, handleSubmit, errors, isSubmitting, onSubmit, onCancel,
}) => {
  return (
    <form className="modal-form cm-form-scope" onSubmit={handleSubmit(onSubmit)} noValidate >
      <div className="grid-2">
        <label>
          Title *
          <input placeholder="Book title" className={errors.title ? "input-error" : ""}
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <span className="field-error">{String(errors.title.message)}</span>}
        </label>

        <label>
          Author *
          <input  placeholder="Book author" className={errors.author ? "input-error" : ""}
            {...register("author", { required: "Author is required" })}
          />
          {errors.author && <span className="field-error">{String(errors.author.message)}</span>}
        </label>

        <label>
          Language *
          <select className={errors.language ? "input-error" : ""}
            {...register("language", { required: "Language is required" })}
          >
            <option value="" disabled>Select language</option>
            {Object.entries(LANGS).map(([code, label]) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
          {errors.language && <span className="field-error">{String(errors.language.message)}</span>}
        </label>

        <label>
          Genre *
          <select className={errors.genre ? "input-error" : ""}
            {...register("genre", { required: "Genre is required" })}
          >
            <option value="" disabled>Select genre</option>
            {Object.entries(GENRES).map(([code, label]) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
          {errors.genre && <span className="field-error">{String(errors.genre.message)}</span>}
        </label>

        <label>
          Published Year *
          <input type="number" placeholder="e.g. 1970" className={errors.publishedYear ? "input-error" : ""}
            {...register("publishedYear", {
              required: "Year is required",
              validate: (v) => {
                const n = Number(v);
                if (!Number.isFinite(n)) return "Invalid number";
                if (n < 0) return "Must be ≥ 0";
                return true;
              },
            })}
          />
          {errors.publishedYear && <span className="field-error">{String(errors.publishedYear.message)}</span>}
        </label>

        <label>
          Read Year
          <input type="number" placeholder="e.g. 2021" className={errors.readYear ? "input-error" : ""}
            {...register("readYear", {
              validate: (v) => {
                if (!v) return true;
                const n = Number(v);
                if (!Number.isFinite(n)) return "Invalid number";
                if (n < 0) return "Must be ≥ 0";
                return true;
              },
            })}
          />
          {errors.readYear && <span className="field-error">{String(errors.readYear.message)}</span>}
        </label>

        <label>
          Pages
          <input type="number" placeholder="240" className={errors.pages ? "input-error" : ""}
            {...register("pages", {
              validate: (v) => {
                if (!v) return true;
                const n = Number(v);
                if (!Number.isFinite(n)) return "Invalid number";
                if (n < 1) return "Must be ≥ 1";
                return true;
              },
            })}
          />
          {errors.pages && <span className="field-error">{String(errors.pages.message)}</span>}
        </label>

        <label>
          Rating (0–5)
          <input type="number" placeholder="0–5" className={errors.rating ? "input-error" : ""}
            {...register("rating", {
              validate: (v) => {
                if (!v && v !== "0") return true;
                const n = Number(v);
                if (!Number.isFinite(n)) return "Invalid number";
                if (n < 0 || n > 5) return "Must be 0–5";
                return true;
              },
            })}
          />
          {errors.rating && <span className="field-error">{String(errors.rating.message)}</span>}
        </label>

        <label className="grid-span-2">
          Image URL
          <input placeholder="https://…" className={errors.image ? "input-error" : ""}
            {...register("image")}
          />
        </label>

        <label className="grid-span-2">
          Description
          <textarea rows={3} placeholder="Short description…" {...register("description")} />
        </label>

        <label className="grid-span-2">
          Notes
          <textarea rows={2} placeholder="Your notes…" {...register("notes")} />
        </label>
      </div>

      <div className="modal-actions">
        <button type="button" className="btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default EditBookForm;