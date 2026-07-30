/**
 * The static vessel, drawn as two layers so the live parts (liquid, cake, label
 * band) can sit between them — glass in front of its own contents, the way a
 * real vial reads.
 *
 * `currentColor` + DaisyUI text utilities keep the glass theme-aware in both
 * light and dark. The only literal colours are the ones that are physically
 * literal: the aluminium crimp and the butyl stopper.
 */
const BODY_PATH =
  "M46 40 L46 54 C46 68 18 66 18 86 L18 184 C18 191 23 195 30 195 L90 195 C97 195 102 191 102 184 L102 86 C102 66 74 68 74 54 L74 40 Z";

const SVG_CLASS = "absolute inset-0 h-full w-full";

export function VialGlassBack() {
  return (
    <svg className={SVG_CLASS} fill="none" viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">
      <g className="text-base-100">
        <path d={BODY_PATH} fill="currentColor" />
      </g>
      <g className="text-base-content">
        <path d={BODY_PATH} fill="currentColor" fillOpacity="0.07" />
      </g>
    </svg>
  );
}

export function VialGlassFront() {
  return (
    <svg className={`${SVG_CLASS} pointer-events-none`} fill="none" viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="peptide-vial-cap" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#8d959d" />
          <stop offset="0.22" stopColor="#e8ecef" />
          <stop offset="0.5" stopColor="#b4bcc3" />
          <stop offset="0.78" stopColor="#dde2e6" />
          <stop offset="1" stopColor="#868e96" />
        </linearGradient>
        <linearGradient id="peptide-vial-stopper" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#463f38" />
          <stop offset="0.45" stopColor="#6d635a" />
          <stop offset="1" stopColor="#3d372f" />
        </linearGradient>
      </defs>

      {/* butyl rubber stopper, seated in the neck under the crimp */}
      <rect fill="url(#peptide-vial-stopper)" height="20" rx="2" width="30" x="45" y="26" />

      {/* aluminium crimp cap with its ridges and skirt */}
      <rect fill="url(#peptide-vial-cap)" height="28" rx="3" width="44" x="38" y="4" />
      {[44, 52, 60, 68, 76].map((x) => (
        <rect fill="#000000" fillOpacity="0.08" height="20" key={x} width="1.5" x={x} y="8" />
      ))}
      <rect fill="#000000" fillOpacity="0.16" height="3" width="44" x="38" y="29" />

      {/* glass edges: a highlight down one side, a soft shadow down the other */}
      <path d="M26 94 C23 104 23 168 26 180 L32 180 C29 168 29 104 32 94 Z" fill="#ffffff" fillOpacity="0.55" />
      <g className="text-base-content">
        <path d="M94 96 C97 106 97 166 94 178 L89 178 C92 166 92 106 89 96 Z" fill="currentColor" fillOpacity="0.08" />
        <path d={BODY_PATH} stroke="currentColor" strokeOpacity="0.22" strokeWidth="2" />
        <path d="M46 41 L74 41" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2" />
      </g>
    </svg>
  );
}
