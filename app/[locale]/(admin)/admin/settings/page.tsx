import { Database, Mail, Shield, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Configuration et administration du système</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <CardTitle>Gestion des utilisateurs</CardTitle>
            </div>
            <CardDescription>Configuration des permissions et rôles utilisateurs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Inscription automatique</h3>
                <p className="text-sm text-muted-foreground">Permettre aux nouveaux utilisateurs de s&apos;inscrire</p>
              </div>
              <Button size="small" variant="outline">
                Configurer
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Modération</h3>
                <p className="text-sm text-muted-foreground">Validation manuelle des nouveaux comptes</p>
              </div>
              <Button size="small" variant="outline">
                Configurer
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configuration des emails et notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Emails de bienvenue</h3>
                <p className="text-sm text-muted-foreground">Envoyer un email aux nouveaux utilisateurs</p>
              </div>
              <Button size="small" variant="outline">
                Configurer
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Rapports hebdomadaires</h3>
                <p className="text-sm text-muted-foreground">Recevoir un résumé des activités</p>
              </div>
              <Button size="small" variant="outline">
                Configurer
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <CardTitle>Base de données</CardTitle>
            </div>
            <CardDescription>Maintenance et sauvegarde des données</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Sauvegarde automatique</h3>
                <p className="text-sm text-muted-foreground">Sauvegardes quotidiennes de la base de données</p>
              </div>
              <Button size="small" variant="outline">
                Configurer
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Nettoyage</h3>
                <p className="text-sm text-muted-foreground">Suppression des données obsolètes</p>
              </div>
              <Button size="small" variant="outline">
                Exécuter
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Sécurité</CardTitle>
            </div>
            <CardDescription>Configuration de la sécurité et des accès</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Authentification à deux facteurs</h3>
                <p className="text-sm text-muted-foreground">Forcer 2FA pour tous les administrateurs</p>
              </div>
              <Button size="small" variant="outline">
                Configurer
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Journaux d&apos;accès</h3>
                <p className="text-sm text-muted-foreground">Enregistrer toutes les actions administratives</p>
              </div>
              <Button size="small" variant="outline">
                Voir les logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
