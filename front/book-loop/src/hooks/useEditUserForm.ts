import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { User } from "../interfaces/users/User";
import { updateUserById } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export type EditFormValues = {
  first: string;
  middle?: string;
  last?: string;
  email: string;
  country: string;
  city: string;
  imageUrl?: string;
  imageAlt?: string;
};

export function useEditUserForm(editingUser: User | null | undefined, onUpdated: (u: User) => void, onClose: () => void) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditFormValues>({
    defaultValues: {
      first: "",
      middle: "",
      last: "",
      email: "",
      country: "",
      city: "",
      imageUrl: "",
      imageAlt: "",
    },
  });

  // наполняем форму значениями при открытии
  useEffect(() => {
    if (!editingUser) return;
    reset({
      first: editingUser.name?.first || "",
      middle: editingUser.name?.middle || "",
      last: editingUser.name?.last || "",
      email: editingUser.email || "",
      country: editingUser.country || "",
      city: editingUser.city || "",
      imageUrl: editingUser.image?.url || "",
      imageAlt: editingUser.image?.alt || "",
    });
  }, [editingUser, reset]);

  async function onSubmit(values: EditFormValues) {
    if (!editingUser?._id) return;
    setIsSaving(true);
    try {
      const payload: Partial<User> = {
        name: { first: values.first, middle: values.middle || "", last: values.last || "" },
        email: values.email,
        country: values.country,
        city: values.city,
        image: { url: values.imageUrl || "", alt: values.imageAlt || "" },
      };
      const { data: updated } = await updateUserById(editingUser._id, payload);
      onUpdated(updated);
      toast.success("User profile updated");
      onClose();
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      // Можно сюда кинуть toast/Swal
      console.error("update-failed", e);
    } finally {
      setIsSaving(false);
    }
  }

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSaving,
    isSubmitting,
  };
}
