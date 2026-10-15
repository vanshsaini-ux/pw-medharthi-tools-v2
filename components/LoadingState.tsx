export default function LoadingState({ label = 'Calculating your result…' }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-12 text-navy-700">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-700/20 border-t-amber-500" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
