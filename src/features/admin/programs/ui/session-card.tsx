"use client";

import { useState } from "react";
import { Plus, Clock, Dumbbell, Settings, ChevronDown, ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { AddExerciseModal } from "./add-exercise-modal";

interface SessionCardProps {
  session: any; // Type from session query
  weekId: string;
}

export function SessionCard({ session, weekId }: SessionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);

  return (
    <Card className="border-l-4 border-l-blue-500">
      <Collapsible onOpenChange={setIsExpanded} open={isExpanded}>
        <CollapsibleTrigger asChild>
          <CardContent className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">
                      Séance {session.sessionNumber}: {session.title}
                    </h4>
                    <Badge size="small" variant={session.isPremium ? "default" : "outline"}>
                      {session.isPremium ? "Premium" : "Gratuit"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{session.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{session.estimatedMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Dumbbell className="h-3 w-3" />
                      <span>
                        {session.exercises.length} exercice{session.exercises.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {session.equipment.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Settings className="h-3 w-3" />
                        <span>{session.equipment.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddExerciseModalOpen(true);
                }}
                size="small"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-1" />
                Exercice
              </Button>
            </div>
          </CardContent>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            {session.exercises.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-muted rounded-lg mx-4">
                <Dumbbell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground mb-3">Aucun exercice dans cette séance</p>
                <Button onClick={() => setIsAddExerciseModalOpen(true)} size="small">
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter le premier exercice
                </Button>
              </div>
            ) : (
              <div className="space-y-2 mx-4">
                {session.exercises.map((exercise: any, index: number) => (
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg" key={exercise.id}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                        {exercise.order + 1}
                      </div>
                      <div>
                        <h5 className="font-medium">{exercise.exercise.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          {exercise.suggestedSets.length} série{exercise.suggestedSets.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <Button size="small" variant="ghost">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      <AddExerciseModal
        nextOrder={session.exercises.length}
        onOpenChange={setIsAddExerciseModalOpen}
        open={isAddExerciseModalOpen}
        sessionId={session.id}
      />
    </Card>
  );
}
