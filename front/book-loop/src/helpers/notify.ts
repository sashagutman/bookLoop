import { toast, type ExternalToast } from "sonner";

type ActionBtn = { label: string; onClick: () => void };

export type NotifyOptions = {
    description?: string;
    duration?: number;
    action?: ActionBtn;
};

function mapOpts(opts?: NotifyOptions): ExternalToast {
    return {
        description: opts?.description,
        duration: opts?.duration,
        action: opts?.action,
    };
}

export const notify = {
    // нейтральное сообщение
    info(message: string, opts?: NotifyOptions) {
        return toast.info(message, mapOpts(opts));
    },

    // успех / ошибка
    success(message: string, opts?: NotifyOptions) {
        return toast.success(message, mapOpts(opts));
    },
    error(message: string, opts?: NotifyOptions) {
        return toast.error(message, mapOpts(opts));
    },

    // варнинг
    warning(message: string, opts?: NotifyOptions) {
        return toast.warning(message, mapOpts(opts));
    },
};