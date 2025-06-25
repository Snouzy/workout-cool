import Link from "next/link";
import { Activity, Calendar, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function DashboardStats() {
  // Mock data - replace with actual data fetching
  const stats = [
    {
      title: "Total Utilisateurs",
      value: "1,234",
      description: "+20% ce mois",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Sessions Actives",
      value: "89",
      description: "+12% aujourd'hui",
      icon: Activity,
      color: "text-green-600",
    },
    {
      title: "Croissance",
      value: "+15%",
      description: "Ce mois-ci",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Évènements",
      value: "42",
      description: "Cette semaine",
      icon: Calendar,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d&apos;ensemble de votre application WorkoutCool</p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Les dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                <div className="flex-1 text-sm">
                  Nouvel utilisateur inscrit
                  <span className="ml-2 text-muted-foreground">Il y a 2 minutes</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-green-600" />
                <div className="flex-1 text-sm">
                  Session d&apos;entraînement terminée
                  <span className="ml-2 text-muted-foreground">Il y a 5 minutes</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-purple-600" />
                <div className="flex-1 text-sm">
                  Nouveau programme créé
                  <span className="ml-2 text-muted-foreground">Il y a 10 minutes</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Raccourcis vers les tâches courantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link className="block rounded-lg border p-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800" href="/admin/users">
                Voir tous les utilisateurs
              </Link>
              <Link className="block rounded-lg border p-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800" href="/admin/analytics">
                Analyser les données
              </Link>
              <Link className="block rounded-lg border p-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800" href="/admin/settings">
                Configurer les paramètres
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
