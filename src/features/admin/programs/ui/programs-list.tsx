import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Edit, Trash2, Users, Calendar, Dumbbell } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getPrograms } from "../actions/get-programs.action";

export async function ProgramsList() {
  const programs = await getPrograms();

  if (programs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun programme</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Commencez par créer votre premier programme d'entraînement.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <Card key={program.id} className="overflow-hidden">
          <div className="relative h-48">
            <Image
              src={program.image}
              alt={program.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute top-4 left-4">
              <Badge variant={program.isPremium ? "default" : "secondary"}>
                {program.isPremium ? "Premium" : "Gratuit"}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {program.level}
              </Badge>
            </div>
          </div>
          
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="truncate">{program.title}</span>
              {program.emoji && (
                <Image
                  src={`/images/emojis/${program.emoji}`}
                  alt="Emoji"
                  width={24}
                  height={24}
                  className="flex-shrink-0"
                />
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {program.description}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{program.durationWeeks} semaines</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{program.totalEnrollments} inscrits</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="text-center">
                <div className="font-semibold text-foreground">{program.totalWeeks}</div>
                <div>Semaines</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">{program.totalSessions}</div>
                <div>Séances</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">{program.totalExercises}</div>
                <div>Exercices</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/admin/programs/${program.id}`}>
                  <Eye className="h-4 w-4 mr-1" />
                  Voir
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/admin/programs/${program.id}/edit`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Éditer
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="px-2">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}