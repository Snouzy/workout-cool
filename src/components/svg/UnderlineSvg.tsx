import type { ComponentPropsWithoutRef } from "react";

export const UnderlineSvg = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg fill="none" height="36" viewBox="0 0 255 36" width="255" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M2.99975 17.6351C116.771 12.3405 178.178 12.7036 252 18.0966"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="5.75696"
      />
    </svg>
  );
};
