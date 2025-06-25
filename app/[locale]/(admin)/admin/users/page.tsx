import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { UsersTable } from "@/features/admin/users/list/ui/users-table";
import { getUsersAction } from "@/entities/user/model/get-users.actions";
import { serverRequiredUser } from "@/entities/user/model/get-server-session-user";

export default async function AdminUsersPage() {
  try {
    const user = await serverRequiredUser();

    if (user.role !== UserRole.admin) {
      redirect("/");
    }

    // Call the action with proper error handling
    const result = await getUsersAction({
      page: 1,
      limit: 10,
    });

    // Check if the action was successful
    if (!result || !result.data) {
      throw new Error("Impossible de charger les utilisateurs");
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">Gestion et administration des comptes utilisateurs</p>
        </div>
        <UsersTable initialUsers={result} />
      </div>
    );
  } catch (error) {
    console.error("Error in admin users page:", error);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">Gestion et administration des comptes utilisateurs</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">Erreur de chargement</h2>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            Impossible de charger la liste des utilisateurs. Veuillez réessayer plus tard.
          </p>
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error instanceof Error ? error.message : "Erreur inconnue"}</p>
        </div>
      </div>
    );
  }
}
