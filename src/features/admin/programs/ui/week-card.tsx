"use client";

import { useState } from "react";
import { Plus, Clock, ChevronDown, ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { SessionCard } from "./session-card";
import { AddSessionModal } from "./add-session-modal";

interface WeekCardProps {
  week: any; // Type from program query
  programId: string;
}

export function WeekCard({ week, programId }: WeekCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);

  return (
    <Card>
      <Collapsible onOpenChange={setIsExpanded} open={isExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <div>
                  <CardTitle className="text-lg">
                    Semaine {week.weekNumber}: {week.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{week.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {week.sessions.length} séance{week.sessions.length !== 1 ? "s" : ""}
                </Badge>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddSessionModalOpen(true);
                  }}
                  size="small"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Séance
                </Button>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {week.sessions.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground mb-3">Aucune séance dans cette semaine</p>
                <Button onClick={() => setIsAddSessionModalOpen(true)} size="small">
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter la première séance
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {week.sessions.map((session: any) => (
                  <SessionCard key={session.id} session={session} weekId={week.id} />
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      <AddSessionModal
        nextSessionNumber={week.sessions.length + 1}
        onOpenChange={setIsAddSessionModalOpen}
        open={isAddSessionModalOpen}
        weekId={week.id}
      />
    </Card>
  );
}
