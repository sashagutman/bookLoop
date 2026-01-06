import Swal from "sweetalert2";

// Подтверждение выхода 
export async function modals(
  {
    title = "Log out?",
    text = "You will need to sign in again to access your library.",
    confirmText = "Log out",
    cancelText = "Cancel",
  }: {
    title?: string;
    text?: string;
    confirmText?: string;
    cancelText?: string;
  } = {}
): Promise<boolean> {
  const res = await Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    focusCancel: true,
  });
  return res.isConfirmed;
}

// Подтверждение удаления пользователя 
export async function confirmDeleteUser(name?: string): Promise<boolean> {
  const res = await Swal.fire({
    title: name ? `Delete user "${name}"?` : "Delete profile?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
  });
  return res.isConfirmed;
}

// подтверждение удаления книги
export async function confirmDeleteBook(title?: string): Promise<boolean> {
  const res = await Swal.fire({
    title: title ? `Delete book "${title}"?` : "Delete this book?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
  });
  return res.isConfirmed;
}

// подтверждение удаления всех книг
export async function confirmDeleteAllBooks(count?: number): Promise<boolean> {
  const res = await Swal.fire({
    title: "Delete ALL your books?",
    text:
      typeof count === "number" && count > 0
        ? `This will permanently delete ${count} ${count === 1 ? "book" : "books"}.`
        : "This will permanently delete all your books.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete all",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
  });
  return res.isConfirmed;
}
// показ заметок к книге
export async function showBookNotesModal(title: string, notes: string): Promise<void> {
  await Swal.fire({
    title: `Notes — ${title}`,
    html: `<div style="text-align:left;white-space:pre-wrap; font-size: 15px;">${escapeHtml(notes)}</div>`,
    confirmButtonText: "Close",
    width: 720,
    padding: "10px",
  });
}

// модал ошибки загрузки списка книг
export async function booksLoadErrorModal(message?: string): Promise<"retry" | "reload" | "cancel"> {
  const res = await Swal.fire({
    title: "Problem loading books",
    text: message || "Couldn’t load the library. Try again?",
    icon: "error",
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: "Retry",
    denyButtonText: "Reload page",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusConfirm: true,
  });

  if (res.isConfirmed) return "retry";
  if (res.isDenied) return "reload";
  return "cancel";
}

// экранирование HTML в заметках
function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}