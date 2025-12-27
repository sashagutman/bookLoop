import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateMe, updateMyPassword } from "../services/userService";
import type { User } from "../interfaces/users/User";

export type ProfileForm = {
  first: string;
  middle?: string;
  last?: string;
  email: string;
  country: string;
  city: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type PasswordForm = { newPassword: string };

type UseEditProfileArgs = {
  open: boolean;
  user: User;
  onClose: () => void;
  onUpdated: (u: User) => void;
};

export function useEditProfile({ open, user, onClose, onUpdated }: UseEditProfileArgs) {
  // Профиль
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    mode: "onSubmit",
    defaultValues: {
      first: user?.name?.first || "",
      middle: user?.name?.middle || "",
      last: user?.name?.last || "",
      email: user?.email || "",
      country: user?.country || "",
      city: user?.city || "",
      imageUrl: user?.image?.url || "",
      imageAlt: user?.image?.alt || "",
    },
  });

  // Пароль
  const {
    register: registerPwd,
    handleSubmit: handleSubmitPwd,
    reset: resetPwd,
    formState: { isSubmitting: isSubmittingPwd },
  } = useForm<PasswordForm>({ mode: "onSubmit", defaultValues: { newPassword: "" } });

  // Синхронизация данных при открытии
  useEffect(() => {
    if (!open) return;
    reset({
      first: user?.name?.first || "",
      middle: user?.name?.middle || "",
      last: user?.name?.last || "",
      email: user?.email || "",
      country: user?.country || "",
      city: user?.city || "",
      imageUrl: user?.image?.url || "",
      imageAlt: user?.image?.alt || "",
    });
    resetPwd({ newPassword: "" });
  }, [open, user, reset, resetPwd]);

  // Сабмит профиля
  const onSubmitProfile = async (v: ProfileForm) => {
    const payload: Partial<User> = {
      name: {
        first: v.first.trim(),
        ...(v.middle ? { middle: v.middle.trim() } : {}),
        ...(v.last ? { last: v.last.trim() } : {}),
      },
      email: v.email.trim().toLowerCase(),
      country: v.country.trim(),
      city: v.city.trim(),
      image: v.imageUrl
        ? { url: v.imageUrl.trim(), alt: (v.imageAlt || "").trim() }
        : undefined,
    };
    try {
      const updatedUser = await updateMe(payload);
      onUpdated(updatedUser);
      toast.success("Profile updated");
      onClose();
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to update profile";
      toast.error(msg);
    }
  };

  // Сабмит пароля
  const onSubmitPassword = async (v: PasswordForm) => {
    try {
      await updateMyPassword(v.newPassword);
      toast.success("Password updated");
      onClose();
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to update password";
      toast.error(msg);
    }
  };

  return {
    // профиль
    register,
    handleSubmit,
    errors,
    isSubmitting,
    // пароль
    registerPwd,
    handleSubmitPwd,
    isSubmittingPwd,
    // хендлеры
    onSubmitProfile,
    onSubmitPassword,
  };
}
