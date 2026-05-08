export function AuthorityScale({ score }: { score: number; max?: number }) {
  return (
    <div className="num text-display-xl font-medium leading-none text-charcoal">
      {score}
    </div>
  );
}
