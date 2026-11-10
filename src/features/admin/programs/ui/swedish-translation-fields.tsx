import type { ComponentProps } from "react";

interface SwedishTranslationFieldsProps {
  titleInput: ComponentProps<"input">;
  descriptionInput: ComponentProps<"textarea">;
}

export function SwedishTranslationFields({ titleInput, descriptionInput }: SwedishTranslationFieldsProps) {
  return (
    <div className="space-y-4" lang="sv">
      <label className="block">
        <span className="label">Titel (svenska)</span>
        <input className="input input-bordered w-full" type="text" {...titleInput} />
      </label>
      <label className="block">
        <span className="label">Beskrivning (svenska)</span>
        <textarea className="textarea textarea-bordered w-full" rows={3} {...descriptionInput} />
      </label>
    </div>
  );
}
