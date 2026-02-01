import { Loader2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export function LoadingSpinner({ className, size = 48, ...props }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)} {...props}>
      <Loader2 className="animate-spin text-primary" size={size} />
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
