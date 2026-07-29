import { Locale } from "locales/types";

export type SectionId = "how-to" | "formula" | "chart" | "conversion" | "u100" | "water" | "mistakes" | "faq";

export interface PeptideSection {
  id: SectionId;
  heading: string;
  lead: string;
  body: string[];
}

export interface PeptideTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface PeptideFAQ {
  question: string;
  answer: string;
}

export interface PeptidePageContent {
  heroSubtitle: string;
  sections: PeptideSection[];
  reconstitutionTable: PeptideTable;
  conversionTable: PeptideTable;
  faq: PeptideFAQ[];
  disclaimer: string;
}

const en: PeptidePageContent = {
  heroSubtitle:
    "Enter your vial size, the bacteriostatic water you added and your dose. Get the exact volume in millilitres and the mark to draw to on a U-100 insulin syringe.",
  sections: [
    {
      id: "how-to",
      heading: "How to use this peptide calculator",
      lead: "Three numbers drive every result on this peptide calculator: the milligrams of peptide printed on the vial, the millilitres of bacteriostatic water you add, and the dose in micrograms you intend to draw. Enter them and the calculator returns the volume in millilitres and the matching mark on your insulin syringe.",
      body: [
        "Start with the vial. A label reading 10 mg is the dry peptide mass, not a volume — there is nothing to measure until you add liquid. Enter 10 mg as the vial size.",
        "Enter the bacteriostatic water next. This is the volume you push into the vial, and it is your choice within the vial's capacity: 5 ml of water into a 10 mg vial gives a concentration of 2 mg per ml. Less water gives a stronger solution and a smaller volume per dose; more water gives a weaker solution and a larger, easier-to-measure volume.",
        "Enter the dose last, in micrograms, exactly as it appears on your prescription or your product's labelling. The calculator does not judge that number — it converts it. A 250 mcg dose at 2 mg per ml is 0.125 ml, which is 12.5 units on a U-100 syringe, and the 10 mg vial holds 40 such doses.",
        "Read the result on the syringe diagram before you draw. The units figure is what you line the plunger up with; the millilitre figure is the same quantity in the unit printed on the barrel of a tuberculin syringe. Both describe one identical volume.",
      ],
    },
    {
      id: "formula",
      heading: "The reconstitution formula, explained",
      lead: "Peptide reconstitution runs on two divisions: concentration equals peptide mass divided by water volume, and dose volume equals dose divided by concentration. A 10 mg vial reconstituted with 5 ml of bacteriostatic water yields 2 mg per ml, so a 250 mcg dose occupies 0.125 ml.",
      body: [
        "Convert to one mass unit before dividing, or the arithmetic falls apart. Micrograms and milligrams differ by a factor of 1,000: 250 mcg is 0.25 mg, and 1,000 mcg is 1 mg. Every mismatch between the two is a tenfold or hundredfold error in the volume you draw.",
        "Work the running example step by step. 10 mg of peptide divided by 5 ml of water is 2 mg/ml. A 250 mcg dose is 0.25 mg. 0.25 mg divided by 2 mg/ml is 0.125 ml. That volume is the answer in millilitres, and everything after it is a change of scale, not a change of quantity.",
        "Doses per vial comes from the same two numbers: total peptide divided by dose. 10 mg is 10,000 mcg, and 10,000 divided by 250 is 40 doses. That figure is a quick sanity check — if the calculator says a 10 mg vial holds three doses of 250 mcg, something in your inputs is wrong.",
      ],
    },
    {
      id: "chart",
      heading: "Peptide reconstitution chart",
      lead: "A reconstitution chart shows what concentration results from each pairing of peptide mass and water volume. The rows below are arithmetic, not suggestions: 10 mg with 2 ml gives 5 mg/ml, and the same 10 mg with 5 ml gives 2 mg/ml. The peptide mass never changes; only the volume it is dissolved in does.",
      body: [
        "Choose a row by the volume you want to be measuring, not by the number that looks tidiest. Higher concentrations mean less liquid per injection and less water sitting in the vial; lower concentrations spread the same dose across more units on the syringe, which makes small doses easier to read accurately.",
        "Nothing in this chart says how much peptide to use. Every row holds the same total mass before and after mixing — adding water changes the concentration and the volume you draw, never the amount of peptide in the vial. Your dose comes from your prescriber or your product's labelling; the chart only tells you what a given mix works out to.",
      ],
    },
    {
      id: "conversion",
      heading: "Converting mcg to insulin syringe units",
      lead: "Insulin syringe units convert from micrograms with a single formula: units equal the dose in micrograms divided by ten times the concentration in mg/ml. At 2 mg/ml, a 250 mcg dose is 250 divided by 20, or 12.5 units. The same dose at 10 mg/ml is 2.5 units.",
      body: [
        "The factor of ten comes from the syringe, not the peptide. One unit on a U-100 syringe is 0.01 ml, so 0.125 ml is 12.5 units. Multiplying the millilitre figure by 100 gets you there just as reliably as the formula above.",
        "Concentration and units move in opposite directions. Double the concentration and the units halve, because the same mass of peptide is packed into half the liquid. That is why the table below reads 12.5, 5 and 2.5 units across a single row: one dose, three mixes, three different marks on the barrel.",
        "Check which syringe you are holding before trusting any unit figure. A U-100 syringe reads 100 units per millilitre; a U-40 syringe reads 40 units per millilitre, and the same 0.125 ml would be 5 units on it. Units are a scale printed on a barrel, not a fixed quantity.",
      ],
    },
    {
      id: "u100",
      heading: "Why a U-100 syringe reads 100 units per millilitre",
      lead: "U-100 is an insulin concentration standard: 100 international units of insulin per millilitre. The barrel is graduated so 100 units fills exactly 1 ml, which makes one unit 0.01 ml. For a reconstituted peptide, the scale carries no insulin meaning — it is simply a fine ruler for hundredths of a millilitre.",
      body: [
        "Syringe capacity and the unit scale are separate things. A 0.3 ml U-100 syringe is marked to 30 units, a 0.5 ml to 50, a 1 ml to 100 — but a unit is 0.01 ml on all three. A 12.5 unit draw fits every one of them; a 60 unit draw does not fit the first two.",
        "Smaller barrels are easier to read. On a 0.3 ml syringe the gradations sit further apart, so 12.5 units lands clearly between two marks rather than crowded against them. When your calculated volume fits, the smaller syringe usually gives the more accurate draw.",
        "Half-unit marks are not universal. Some barrels are printed in one-unit steps only, in which case 12.5 units has to be estimated between marks, or the mix adjusted so the number lands on a printed line. Look at your own syringe before assuming the precision the calculator implies.",
      ],
    },
    {
      id: "water",
      heading: "Bacteriostatic water vs sterile water",
      lead: "Bacteriostatic water is sterile water containing 0.9% benzyl alcohol, a preservative that inhibits bacterial growth and allows a vial to be entered more than once. Sterile water carries no preservative, so once its seal is pierced it offers no protection against contamination between draws.",
      body: [
        "Neither liquid changes the arithmetic. 5 ml is 5 ml, and a 10 mg vial reconstituted with either one gives 2 mg/ml. The choice affects how long a reconstituted vial stays usable and how it must be stored, not the volume you draw.",
        "Follow the diluent named on your product's labelling. Some peptides are specified with bacteriostatic water, some with sterile water, and some with a different diluent entirely; benzyl alcohol is itself the reason certain products are never reconstituted with it. Where the labelling and a forum post disagree, the labelling wins.",
        "Add the water slowly down the inside wall of the vial rather than squirting it onto the powder, and let the vial sit until the solution runs clear. Do not shake it. Peptides are fragile molecules, and agitation degrades them without changing anything the calculator measures.",
      ],
    },
    {
      id: "mistakes",
      heading: "Common peptide calculation mistakes",
      lead: "Most peptide calculation errors are unit errors, and they are large: confusing micrograms with milligrams misplaces the decimal by a factor of 1,000, and reading a U-40 syringe as though it were U-100 misreads the volume by a factor of 2.5. Both produce a number that looks plausible on the barrel.",
      body: [
        "Assuming the water volume is fixed comes next. There is no standard amount of bacteriostatic water for a 10 mg vial — 2 ml gives 5 mg/ml and 5 ml gives 2 mg/ml — so a unit figure copied from someone else's vial is wrong on yours. Recalculate for the volume you actually added.",
        "Reusing a figure after changing the mix is the same mistake in slow motion. If 250 mcg was 12.5 units on your last vial, it is 12.5 units on this one only when the concentration is identical. Rerun the numbers every time you reconstitute.",
        "Two smaller ones are worth a check. The powder itself occupies a little volume, so the final liquid can sit slightly above the water you added; the calculator assumes it does not. And a peptide labelled in international units rather than milligrams cannot be entered into a mg-based calculation without the conversion factor for that specific product.",
      ],
    },
    {
      id: "faq",
      heading: "Frequently asked questions",
      lead: "Common questions about peptide reconstitution, bacteriostatic water volumes and insulin syringe units are answered below. Each answer applies the same two steps the calculator uses: divide the peptide mass by the water volume to get a concentration, then divide the dose by that concentration to get a volume.",
      body: [],
    },
  ],
  reconstitutionTable: {
    caption: "Peptide reconstitution chart",
    headers: ["Peptide amount", "Bacteriostatic water added", "Final concentration"],
    rows: [
      ["5 mg", "1 mL", "5 mg/mL"],
      ["5 mg", "2 mL", "2.5 mg/mL"],
      ["10 mg", "2 mL", "5 mg/mL"],
      ["10 mg", "5 mL", "2 mg/mL"],
      ["15 mg", "3 mL", "5 mg/mL"],
      ["20 mg", "4 mL", "5 mg/mL"],
      ["30 mg", "3 mL", "10 mg/mL"],
    ],
  },
  conversionTable: {
    caption: "Dose to insulin syringe units",
    headers: ["Dose", "at 2 mg/mL", "at 5 mg/mL", "at 10 mg/mL"],
    rows: [
      ["250 mcg", "12.5 U", "5 U", "2.5 U"],
      ["500 mcg", "25 U", "10 U", "5 U"],
      ["1000 mcg", "50 U", "20 U", "10 U"],
      ["2000 mcg", "100 U", "40 U", "20 U"],
    ],
  },
  faq: [
    {
      question: "How to calculate peptide reconstitution?",
      answer:
        "Divide the peptide mass by the volume of bacteriostatic water to get the concentration, then divide your dose by that concentration to get the volume to draw. A 10 mg vial with 5 ml of water is 2 mg/ml, so a 250 mcg dose is 0.125 ml, or 12.5 units.",
    },
    {
      question: "How many mL of bacteriostatic water to mix with peptides?",
      answer:
        "Any volume the vial holds — the amount you add sets the concentration rather than the potency. 2 ml into a 10 mg vial gives 5 mg/ml; 5 ml gives 2 mg/ml. Larger volumes make small doses easier to read on the syringe. Follow the diluent volume on your product's labelling.",
    },
    {
      question: "How many mL to reconstitute 10 mg?",
      answer:
        "Any volume between roughly 1 ml and the vial's capacity works, and each gives a different concentration: 1 ml gives 10 mg/ml, 2 ml gives 5 mg/ml, and 5 ml gives 2 mg/ml. Pick the volume named on your product's labelling, then calculate your dose against the resulting concentration.",
    },
    {
      question: "How to reconstitute 30 mg of peptides?",
      answer:
        "Add your chosen volume of bacteriostatic water slowly down the vial wall and let it dissolve without shaking. 3 ml into a 30 mg vial gives 10 mg/ml, and 6 ml gives 5 mg/ml. Divide 30 mg by the millilitres you added to get the concentration, then convert your dose against it.",
    },
    {
      question: "How much water to reconstitute 10 mg of peptide?",
      answer:
        "Water volume is your choice, and it determines concentration: 1 ml of bacteriostatic water gives 10 mg/ml, 2 ml gives 5 mg/ml, 4 ml gives 2.5 mg/ml, and 5 ml gives 2 mg/ml. All four contain the same 10 mg of peptide — only the volume you draw per dose changes.",
    },
    {
      question: "How to figure out reconstitution?",
      answer:
        "Work in two divisions. First, peptide mass divided by water volume gives the concentration in mg/ml. Second, your dose divided by that concentration gives the volume in ml. Multiply that volume by 100 for units on a U-100 syringe. Convert micrograms to milligrams first — 250 mcg is 0.25 mg.",
    },
    {
      question: "How many units is 250 mcg on an insulin syringe?",
      answer:
        "Units depend on the concentration of your vial. On a U-100 syringe, 250 mcg is 12.5 units at 2 mg/ml, 5 units at 5 mg/ml, and 2.5 units at 10 mg/ml. Divide the dose in micrograms by ten times the concentration in mg/ml to get units for any other mix.",
    },
    {
      question: "What does U-100 mean on an insulin syringe?",
      answer:
        "U-100 means the barrel is graduated for a concentration of 100 units per millilitre, so one unit equals 0.01 ml and 100 units fills 1 ml. U-40 syringes are graduated at 40 units per millilitre instead. Reading a volume on the wrong scale gives a 2.5-fold error.",
    },
  ],
  disclaimer:
    "Conversion tool only. Always verify concentration, syringe unit scale and any prescription with a qualified healthcare professional. This calculator does not provide medical advice.",
};

export const PEPTIDE_CALCULATOR_CONTENT: Partial<Record<Locale, PeptidePageContent>> = { en };

/** Repli utilisé tant qu'une locale n'a pas son contenu rédigé. */
export const PEPTIDE_CALCULATOR_CONTENT_FALLBACK = en;
