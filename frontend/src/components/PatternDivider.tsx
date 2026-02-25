interface PatternDividerProps {
  className?: string;
  thin?: boolean;
}

export default function PatternDivider({ className = '', thin = false }: PatternDividerProps) {
  return (
    <div
      className={`w-full ${thin ? 'kente-pattern-thin' : 'kente-pattern'} ${className}`}
      role="separator"
      aria-hidden="true"
    />
  );
}
