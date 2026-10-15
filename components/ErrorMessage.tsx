interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div role="alert" className="rounded-lg border border-coral-500/30 bg-coral-100 p-4 text-sm text-coral-500">
      <p className="font-medium">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 font-semibold underline hover:no-underline">
          Try again
        </button>
      )}
    </div>
  );
}
