import { toast } from "sonner";
import { likeDislikeBook, toggleWant } from "../services/booksService";
import { invalidateStats } from "./useUserStat";
import type { Book } from "../interfaces/books/Book";

type FlipKey = "liked" | "want";

export function useBookActions(
  opts: {
    isAuthenticated: boolean;
    userId: string | null;
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  }
) {
  const ensureAuth = () => !!(opts.isAuthenticated && opts.userId);

  const flipPersonal = (bookId: string, key: FlipKey) => {
    opts.setBooks(prev =>
      prev.map(b =>
        b._id !== bookId
          ? b
          : { ...b, _personal: { ...(b._personal ?? {}), [key]: !b._personal?.[key] } }
      )
    );
  };

  const onToggleFavorite = async (bookId: string) => {
    if (!ensureAuth()) {
      toast.warning("You must be a registered user to add to your favorites");
      return;
    }
    flipPersonal(bookId, "liked");
    try {
      await likeDislikeBook(bookId);
      invalidateStats();
      toast.success("Favorites updated");
    } catch {
      flipPersonal(bookId, "liked");
      toast.error("Failed to update favorites");
    }
  };

  const onToggleWant = async (bookId: string) => {
    if (!ensureAuth()) {
      toast.warning("You must be a registered user to add to your to read list");
      return;
    }
    flipPersonal(bookId, "want");
    try {
      await toggleWant(bookId);
      invalidateStats();
      toast.success("Want to read updated");
    } catch {
      flipPersonal(bookId, "want");
      toast.error("Failed to update Want to read");
    }
  };

  return { onToggleFavorite, onToggleWant };
}
