"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Clock, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AddWeekModal } from "./add-week-modal";
import { WeekCard } from "./week-card";

interface ProgramBuilderProps {
  program: any; // Type from getProgramById
}

export function ProgramBuilder({ program }: ProgramBuilderProps) {
  const [isAddWeekModalOpen, setIsAddWeekModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/programs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux programmes
          </Link>
        </Button>
      </div>

      {/* Program Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-2xl">{program.title}</CardTitle>
                  {program.emoji && (
                    <Image
                      src={`/images/emojis/${program.emoji}`}
                      alt="Emoji"
                      width={32}
                      height={32}
                    />
                  )}
                </div>
                <p className="text-muted-foreground mb-3">{program.description}</p>
                <div className="flex gap-2">
                  <Badge variant={program.isPremium ? "default" : "secondary"}>
                    {program.isPremium ? "Premium" : "Gratuit"}
                  </Badge>
                  <Badge variant="outline">{program.level}</Badge>
                  <Badge variant="outline">{program.category}</Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Participants</div>
              <div className="text-2xl font-bold">{program.participantCount}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{program.durationWeeks} semaines</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{program.sessionDurationMin} min/séance</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{program.sessionsPerWeek} séances/semaine</span>
            </div>
            <div>
              <span className="text-muted-foreground">Équipement: </span>
              <span>{program.equipment.join(", ") || "Aucun"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="structure" className="space-y-6">
        <TabsList>
          <TabsTrigger value="structure">Structure du programme</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="analytics">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-6">
          {/* Add Week Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Semaines ({program.weeks.length}/{program.durationWeeks})
            </h3>
            <Button onClick={() => setIsAddWeekModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une semaine
            </Button>
          </div>

          {/* Weeks List */}
          <div className="space-y-4">
            {program.weeks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Aucune semaine créée</h4>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Commencez par ajouter la première semaine de votre programme.
                  </p>
                  <Button onClick={() => setIsAddWeekModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter la première semaine
                  </Button>
                </CardContent>
              </Card>
            ) : (
              program.weeks.map((week: any) => (
                <WeekCard key={week.id} week={week} programId={program.id} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du programme</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configuration avancée du programme (à implémenter)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analytics et métriques du programme (à implémenter)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Week Modal */}
      <AddWeekModal
        open={isAddWeekModalOpen}
        onOpenChange={setIsAddWeekModalOpen}
        programId={program.id}
        nextWeekNumber={program.weeks.length + 1}
      />
    </div>
  );
}