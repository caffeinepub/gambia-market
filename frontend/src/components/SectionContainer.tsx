import { ReactNode } from 'react';

interface SectionContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function SectionContainer({ title, subtitle, children, className = '' }: SectionContainerProps) {
  return (
    <section className={`py-10 px-4 md:px-8 max-w-6xl mx-auto section-fade-in ${className}`}>
      <div className="mb-8">
        <h2 className="font-heading font-black text-2xl md:text-3xl text-foreground mb-2">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground font-body text-base max-w-2xl">{subtitle}</p>
        )}
        <div className="kente-pattern-thin w-24 mt-3 rounded-full" />
      </div>
      {children}
    </section>
  );
}
