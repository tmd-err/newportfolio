import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A scroll act: a tall section whose content pins to the viewport while
 * the 3D camera moves behind it. Heights are expressed in svh so the
 * scroll fraction of each act stays constant across viewport sizes —
 * this is what keeps the camera keyframes synchronized with content.
 */
export function SceneSection({
  id,
  vh,
  children,
  className,
  innerClassName,
}: {
  id: string;
  vh: number;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section
      id={id}
      data-act={id}
      className={cn("relative", className)}
      style={{ minHeight: `${vh}svh` }}
      aria-label={id}
    >
      <div
        className={cn(
          "sticky top-0 mx-auto flex min-h-svh w-full max-w-7xl items-center px-5 sm:px-10",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
