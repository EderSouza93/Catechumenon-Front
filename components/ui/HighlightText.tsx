import { escapeRegex } from '@/utils/searchUtils';

interface HighlightTextProps {
  text: string;
  query: string;
  className?: string;
  highlightClassName?: string;
}

export default function HighlightText({
  text,
  query,
  className,
  highlightClassName = 'bg-amber-200 dark:bg-amber-700 rounded-sm px-0.5',
}: HighlightTextProps) {
  if (!query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className={highlightClassName}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}
