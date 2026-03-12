import type { ReactNode } from 'react';

type PageWrapperProps = {
  title?: string;
  children: ReactNode;
};

export default function PageWrapper({ title, children }: PageWrapperProps) {
  return (
    <section className="space-y-6">
      {title ? (
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        </div>
      ) : null}
      {children}
    </section>
  );
}
