import type {ReactNode} from 'react';

type SearchResultCardProps = {
  title: string;
  meta: string;
  actions: ReactNode;
};

export function SearchResultCard({title, meta, actions}: SearchResultCardProps) {
  return (
    <article className="soft-panel p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-lg font-semibold text-ink">{title}</div>
          <div className="mt-1 text-sm text-muted">{meta}</div>
        </div>
        <div className="flex flex-wrap gap-2">{actions}</div>
      </div>
    </article>
  );
}

