import * as React from "react";

// On utilise l'image SVG du dossier public
export const CalendlyIcon: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img
    alt="Calendly"
    height={20}
    src="/icons/calendly.svg"
    style={{ display: "inline-block", verticalAlign: "middle" }}
    width={20}
    {...props}
  />
);
