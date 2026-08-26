"use client";

import { Check, X, AlertCircle, Info, AlertTriangle, Loader2 } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type ToastType = "success" | "error" | "info" | "warning" | "loading";

export interface ToastOptions {
  description?: string;
  duration?: number;
  id?: string | number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastComponentProps {
  id: string | number;
  type: ToastType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/* -------------------------------------------------------------------------- */
/* Frosted Glass Dynamic Island Toast Component                               */
/* -------------------------------------------------------------------------- */

/**
 * Premium Frosted Light Glass Dynamic Island Toast.
 * Features a high-blur translucent capsule, crisp dark typography,
 * subtitle description support, and vibrant color-accent badges.
 */
function DynamicIslandToast({
  id,
  type,
  title,
  description,
  action,
}: ToastComponentProps) {
  const hasDescription = Boolean(description);

  return (
    <div
      className={cn(
        "group pointer-events-auto flex items-center gap-2",
        hasDescription ? "rounded-2xl px-4 py-2.5" : "rounded-full px-3.5 py-2",
        "bg-white/90 backdrop-blur-2xl backdrop-saturate-150",
        "border border-black/[0.08] shadow-[0_20px_42px_-10px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.04)]",
        "text-zinc-900 font-sans transition-all duration-300 ease-out",
        "min-w-[280px] max-w-[460px] select-none",
      )}
    >
      {/* Icon Badge with Soft Glow Ring */}
      <div className={cn("flex shrink-0 items-center justify-center", hasDescription && "self-start mt-0.5")}>
        {type === "success" && (
          <div className="flex size-5.5 items-center justify-center rounded-full bg-emerald-500/15 text-[#18694f] ring-1 ring-emerald-500/25">
            <Check className="size-3 stroke-[3]" />
          </div>
        )}
        {type === "error" && (
          <div className="flex size-5.5 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 ring-1 ring-rose-500/25">
            <AlertCircle className="size-3 stroke-[3]" />
          </div>
        )}
        {type === "info" && (
          <div className="flex size-5.5 items-center justify-center rounded-full bg-sky-500/15 text-sky-600 ring-1 ring-sky-500/25">
            <Info className="size-3 stroke-[3]" />
          </div>
        )}
        {type === "warning" && (
          <div className="flex size-5.5 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/25">
            <AlertTriangle className="size-3 stroke-[3]" />
          </div>
        )}
        {type === "loading" && (
          <div className="flex size-5.5 items-center justify-center rounded-full bg-emerald-500/15 text-[#18694f] ring-1 ring-emerald-500/25">
            <Loader2 className="size-3 stroke-[3] animate-spin" />
          </div>
        )}
      </div>

      {/* Text Content: Title and Description */}
      <div className="flex flex-1 flex-col min-w-0 pr-1">
        <p className="text-xs font-bold text-zinc-900 tracking-tight leading-snug truncate">
          {title}
        </p>
        {description && (
          <p className="text-[11px] text-zinc-500 leading-relaxed truncate mt-0.5 font-medium">
            {description}
          </p>
        )}
      </div>

      {/* Optional Action Button */}
      {action && (
        <button
          type="button"
          onClick={() => {
            action.onClick();
            sonnerToast.dismiss(id);
          }}
          className="shrink-0 rounded-full bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-zinc-800 transition-colors shadow-2xs"
        >
          {action.label}
        </button>
      )}

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={() => sonnerToast.dismiss(id)}
        className={cn(
          "shrink-0 rounded-full p-1 text-zinc-400 hover:text-zinc-700 hover:bg-black/5 transition-colors",
          hasDescription && "self-start",
        )}
        aria-label="Dismiss notification"
      >
        <X className="size-3 stroke-[2.5]" />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Public Toast API                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Unified LÉVARO Light Glass Dynamic Island Toast Service.
 */
export const toast = {
  /**
   * Displays a success light glass notification with title and optional description.
   */
  success: (title: string, descriptionOrOptions?: string | ToastOptions) => {
    const opts =
      typeof descriptionOrOptions === "string"
        ? { description: descriptionOrOptions }
        : descriptionOrOptions;

    return sonnerToast.custom(
      (t) => (
        <DynamicIslandToast
          id={t}
          type="success"
          title={title}
          description={opts?.description}
          action={opts?.action}
        />
      ),
      {
        duration: opts?.duration ?? 3500,
        id: opts?.id,
      },
    );
  },

  /**
   * Displays an error light glass notification with title and optional description.
   */
  error: (title: string, descriptionOrOptions?: string | ToastOptions) => {
    const opts =
      typeof descriptionOrOptions === "string"
        ? { description: descriptionOrOptions }
        : descriptionOrOptions;

    return sonnerToast.custom(
      (t) => (
        <DynamicIslandToast
          id={t}
          type="error"
          title={title}
          description={opts?.description}
          action={opts?.action}
        />
      ),
      {
        duration: opts?.duration ?? 4000,
        id: opts?.id,
      },
    );
  },

  /**
   * Displays an informational light glass notification with title and optional description.
   */
  info: (title: string, descriptionOrOptions?: string | ToastOptions) => {
    const opts =
      typeof descriptionOrOptions === "string"
        ? { description: descriptionOrOptions }
        : descriptionOrOptions;

    return sonnerToast.custom(
      (t) => (
        <DynamicIslandToast
          id={t}
          type="info"
          title={title}
          description={opts?.description}
          action={opts?.action}
        />
      ),
      {
        duration: opts?.duration ?? 3500,
        id: opts?.id,
      },
    );
  },

  /**
   * Displays a warning light glass notification with title and optional description.
   */
  warning: (title: string, descriptionOrOptions?: string | ToastOptions) => {
    const opts =
      typeof descriptionOrOptions === "string"
        ? { description: descriptionOrOptions }
        : descriptionOrOptions;

    return sonnerToast.custom(
      (t) => (
        <DynamicIslandToast
          id={t}
          type="warning"
          title={title}
          description={opts?.description}
          action={opts?.action}
        />
      ),
      {
        duration: opts?.duration ?? 4000,
        id: opts?.id,
      },
    );
  },

  /**
   * Displays a persistent loading spinner notification with title and optional description.
   */
  loading: (title: string, descriptionOrOptions?: string | ToastOptions) => {
    const opts =
      typeof descriptionOrOptions === "string"
        ? { description: descriptionOrOptions }
        : descriptionOrOptions;

    return sonnerToast.custom(
      (t) => (
        <DynamicIslandToast
          id={t}
          type="loading"
          title={title}
          description={opts?.description}
          action={opts?.action}
        />
      ),
      {
        duration: Infinity,
        id: opts?.id,
      },
    );
  },

  /**
   * Automatically handles promise states (loading -> success or error).
   */
  promise: <T,>(
    promise: Promise<T>,
    data: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
      description?: string;
    },
  ) => {
    const toastId = toast.loading(data.loading, {
      description: data.description,
    });

    promise
      .then((res) => {
        const msg =
          typeof data.success === "function" ? data.success(res) : data.success;
        sonnerToast.dismiss(toastId);
        toast.success(msg);
        return res;
      })
      .catch((err) => {
        const msg =
          typeof data.error === "function" ? data.error(err) : data.error;
        sonnerToast.dismiss(toastId);
        toast.error(msg);
        throw err;
      });

    return promise;
  },

  /**
   * Dismisses an active toast by ID or all active toasts.
   */
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },
};

export default toast;
