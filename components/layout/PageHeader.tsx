type PageHeaderProps = { title?: string; description: string };

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="px-10 pb-6 pt-8">
      {title && (
        <h2 className="font-serif text-display-md font-extralight text-charcoal">
          {title}
        </h2>
      )}
      <p className="max-w-prose pt-2 text-sm text-graphite">{description}</p>
    </div>
  );
}
