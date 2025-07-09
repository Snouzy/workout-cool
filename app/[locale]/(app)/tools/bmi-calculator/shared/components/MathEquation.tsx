"use client";

interface MathEquationProps {
  equation: string;
  display?: boolean;
  className?: string;
}

export function MathEquation({ equation, display = false, className = "" }: MathEquationProps) {
  return (
    <div className={`math-equation ${display ? "block" : "inline-block"} ${className}`}>
      <span
        className="font-mono text-lg"
        dangerouslySetInnerHTML={{ __html: equation }}
        style={{ fontFamily: "KaTeX_Math, Times New Roman, serif" }}
      />
    </div>
  );
}

interface FormulaCardProps {
  title: string;
  equation: string;
  example?: string;
  description?: string;
  className?: string;
}

export function FormulaCard({ title, equation, example, description, className = "" }: FormulaCardProps) {
  return (
    <div className={`bg-base-200 p-6 rounded-lg space-y-4 ${className}`}>
      <h4 className="text-lg font-semibold text-base-content text-center">{title}</h4>

      <div className="text-center py-4">
        <div className="text-xl font-mono" style={{ fontFamily: "KaTeX_Math, Times New Roman, serif" }}>
          <div dangerouslySetInnerHTML={{ __html: equation }} />
        </div>
      </div>

      {description && <p className="text-sm text-base-content/70 text-center">{description}</p>}

      {example && (
        <div className="text-center border-t border-base-content/10 pt-4">
          <p className="text-sm text-base-content/60 mb-2">Example:</p>
          <div className="text-lg font-mono" style={{ fontFamily: "KaTeX_Math, Times New Roman, serif" }}>
            <div dangerouslySetInnerHTML={{ __html: example }} />
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to create fraction notation
export function createFraction(numerator: string, denominator: string): string {
  return `
    <div style="display: inline-block; text-align: center; vertical-align: middle;">
      <div style="border-bottom: 1px solid currentColor; padding: 0 4px;">${numerator}</div>
      <div style="padding: 0 4px;">${denominator}</div>
    </div>
  `;
}

// Helper function for superscript
export function createSuperscript(base: string, exponent: string): string {
  return `${base}<sup style="font-size: 0.8em;">${exponent}</sup>`;
}

// Helper function for subscript
export function createSubscript(base: string, subscript: string): string {
  return `${base}<sub style="font-size: 0.8em;">${subscript}</sub>`;
}
