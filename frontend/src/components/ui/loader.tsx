import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse" | "bars";
  className?: string;
}

export function Loader({ size = "md", variant = "spinner", className }: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  if (variant === "spinner") {
    return (
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-gray-300 border-t-primary",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex space-x-1", className)}>
        <div
          className={cn("rounded-full bg-primary animate-bounce", sizeClasses[size])}
          style={{ animationDelay: "0ms" }}
        />
        <div
          className={cn("rounded-full bg-primary animate-bounce", sizeClasses[size])}
          style={{ animationDelay: "150ms" }}
        />
        <div
          className={cn("rounded-full bg-primary animate-bounce", sizeClasses[size])}
          style={{ animationDelay: "300ms" }}
        />
      </div>
    );
  }

  if (variant === "pulse") {
    return <div className={cn("rounded-full bg-primary animate-pulse", sizeClasses[size], className)} />;
  }

  if (variant === "bars") {
    return (
      <div className={cn("flex space-x-1", className)}>
        <div
          className="w-1 bg-primary animate-pulse"
          style={{
            height: size === "sm" ? "16px" : size === "md" ? "24px" : size === "lg" ? "32px" : "48px",
            animationDelay: "0ms",
          }}
        />
        <div
          className="w-1 bg-primary animate-pulse"
          style={{
            height: size === "sm" ? "16px" : size === "md" ? "24px" : size === "lg" ? "32px" : "48px",
            animationDelay: "150ms",
          }}
        />
        <div
          className="w-1 bg-primary animate-pulse"
          style={{
            height: size === "sm" ? "16px" : size === "md" ? "24px" : size === "lg" ? "32px" : "48px",
            animationDelay: "300ms",
          }}
        />
        <div
          className="w-1 bg-primary animate-pulse"
          style={{
            height: size === "sm" ? "16px" : size === "md" ? "24px" : size === "lg" ? "32px" : "48px",
            animationDelay: "450ms",
          }}
        />
      </div>
    );
  }

  return null;
}
