/**
 * The static vessel, drawn as two layers so the live parts (liquid, cake, label
 * band) can sit between them — glass in front of its own contents, the way a
 * real vial reads.
 *
 * `currentColor` + DaisyUI text utilities keep the glass theme-aware in both
 * light and dark. The only literal colours are the ones that are physically
 * literal: the aluminium crimp and the butyl stopper.
 */

/**
 * Proportions are what make this read as a reagent vial rather than a soda bottle.
 * A real crimped 10 mL vial is roughly 22 mm across the body, a 20 mm cap and a
 * 13 mm neck — so the cap is nearly as wide as the body and the shoulder is a
 * short, tight step, not a long taper.
 *
 * Here, in this file's 120×200 viewBox: body x26→94 (68 wide), neck x42→78
 * (36 wide, 53% of the body), cap x38→82 (44 wide, 65% of the body and
 * overhanging the neck by 4 each side, the way a crimp does). The shoulder drops
 * only y52→y66, so the straight body is most of the vessel.
 */
const BODY_PATH =
  "M42 38 L42 52 C42 59 30 60 26 66 L26 186 C26 192 31 196 37 196 L83 196 C89 196 94 192 94 186 L94 66 C90 60 78 59 78 52 L78 38 Z";

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
      <path d="M32 90 C29 100 29 170 32 182 L38 182 C35 170 35 100 38 90 Z" fill="#ffffff" fillOpacity="0.55" />
      <g className="text-base-content">
        <path d="M88 92 C91 102 91 168 88 180 L83 180 C86 168 86 102 83 92 Z" fill="currentColor" fillOpacity="0.08" />
        <path d={BODY_PATH} stroke="currentColor" strokeOpacity="0.22" strokeWidth="2" />
        <path d="M42 41 L78 41" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2" />
      </g>
    </svg>
  );
}
