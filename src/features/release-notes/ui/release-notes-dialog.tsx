"use client";

import * as React from "react";
import { Bell } from "lucide-react";

import { useCurrentLocale, useI18n } from "locales/client";
import { formatDate } from "@/shared/lib/date";
import { InlineTooltip } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { releaseNotes } from "../model/notes";

export function ReleaseNotesDialog() {
  const t = useI18n();
  const locale = useCurrentLocale();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button aria-label={t("release_notes.release_notes")} className="rounded-full hover:bg-slate-100" size="small" variant="ghost">
          <InlineTooltip title="Annonces / Changelog">
            <Bell className="text-blue-500 h-6 w-6" />
          </InlineTooltip>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("release_notes.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {releaseNotes.map((note) => (
            <div className="border-b pb-2 last:border-b-0 last:pb-0" key={note.date}>
              <div className="text-xs text-muted-foreground">{formatDate(note.date, locale)}</div>
              <div className="font-semibold">{t(note.titleKey as keyof typeof t)}</div>
              <div className="text-sm">{t(note.contentKey as keyof typeof t)}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
