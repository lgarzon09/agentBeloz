import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  variant: "agent" | "user";
  label?: string;
  children: React.ReactNode;
  timestamp?: string;
};

export function MessageBubble({
  variant,
  label,
  children,
  timestamp,
}: MessageBubbleProps) {
  const isAgent = variant === "agent";

  return (
    <div className={cn("flex", isAgent ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-3 text-sm leading-relaxed",
          isAgent
            ? "bg-gray-100 text-brand-text"
            : "bg-brand-navy text-white"
        )}
      >
        {label && (
          <p className="text-xs font-semibold text-brand-muted mb-1">
            {label}
          </p>
        )}
        <p className="whitespace-pre-wrap">{children}</p>
        {timestamp && (
          <p
            className={cn(
              "text-[10px] mt-1",
              isAgent ? "text-brand-muted" : "text-white/60"
            )}
          >
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
