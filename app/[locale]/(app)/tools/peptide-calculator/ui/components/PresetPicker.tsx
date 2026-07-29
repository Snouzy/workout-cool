import { PeptidePreset } from "../../lib/presets";

interface PresetPickerProps {
  legend: string;
  presets: PeptidePreset[];
  onSelect: (vialMg: number) => void;
}

export function PresetPicker({ legend, presets, onSelect }: PresetPickerProps) {
  return (
    <div className="mb-8">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-base-content/50">{legend}</p>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            className="rounded-full border border-base-content/15 bg-base-100 px-3 py-1.5 text-sm font-medium text-base-content/80 transition-colors hover:border-primary/50 hover:text-primary"
            key={preset.id}
            onClick={() => onSelect(preset.vialSizesMg[0])}
            type="button"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
