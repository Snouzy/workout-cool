import type { ComponentPropsWithoutRef } from "react";

export type LogoSvgProps = ComponentPropsWithoutRef<"svg"> & { size?: number };

export const LogoSvg = ({ size = 32, ...props }: LogoSvgProps) => {
  return (
    <svg height={size} viewBox="0 0 100 40" width={size} xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Disque gauche */}
      <circle className="opacity-90" cx="15" cy="20" fill="currentColor" r="12" />

      {/* Barre centrale */}
      <rect fill="currentColor" height="4" rx="2" width="76" x="12" y="18" />

      {/* Disque droit */}
      <circle className="opacity-90" cx="85" cy="20" fill="currentColor" r="12" />

      {/* Poignée centrale (optionnel pour plus de détail) */}
      <rect className="opacity-50" fill="none" height="8" rx="4" stroke="currentColor" strokeWidth="1" width="20" x="40" y="16" />
    </svg>
  );
};
