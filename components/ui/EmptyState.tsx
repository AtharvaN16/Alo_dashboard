export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-32 items-center justify-center text-sm text-stone">
      {message}
    </div>
  );
}
