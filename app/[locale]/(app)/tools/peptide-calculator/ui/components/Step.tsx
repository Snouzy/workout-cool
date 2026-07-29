import { ReactNode } from "react";

interface StepProps {
  number: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}

export function Step({ number, eyebrow, title, children }: StepProps) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-content">
          {number}
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-base-content/50">{eyebrow}</p>
          <h2 className="text-lg font-bold text-base-content">{title}</h2>
        </div>
      </div>
      {children}
    </div>
  );
}
