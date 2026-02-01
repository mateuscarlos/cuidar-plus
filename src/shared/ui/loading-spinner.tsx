import { cn } from "@/shared/utils/cn";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function LoadingSpinner({ className, message = "Carregando...", ...props }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center h-full min-h-[200px]", className)} {...props}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
