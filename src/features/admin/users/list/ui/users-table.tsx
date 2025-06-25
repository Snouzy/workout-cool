"use client";

import { useCallback, useState, useEffect } from "react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Eye, ArrowDown, ArrowUp, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/features/auth/lib/auth-client";
import { getUsersAction } from "@/entities/user/model/get-users.actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define valid sortable columns
const sortableColumns = ["createdAt", "email"] as const;
type SortableColumn = (typeof sortableColumns)[number];

const orderableColumns = ["asc", "desc"] as const;
type OrderableColumn = (typeof orderableColumns)[number];

interface UsersTableProps {
  initialUsers: Awaited<ReturnType<typeof getUsersAction>>;
}

export function UsersTable({ initialUsers }: UsersTableProps) {
  const [page, setPage] = useQueryState("page", { defaultValue: "1" });
  const [searchQuery, setSearchQuery] = useQueryState("search", parseAsStringLiteral<string>([]).withDefault(""));
  const [sortBy, setSortBy] = useQueryState("sortBy", parseAsStringLiteral<SortableColumn>(sortableColumns).withDefault("createdAt"));
  const [sortOrder, setSortOrder] = useQueryState("sortOrder", parseAsStringLiteral<OrderableColumn>(orderableColumns).withDefault("desc"));
  const [impersonatingUserId, setImpersonatingUserId] = useState<string | null>(null);

  // Local state for the search input field
  const [inputValue, setInputValue] = useState(searchQuery);

  const pageNumber = parseInt(page || "1", 10);

  // Debounce search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue !== searchQuery) {
        setSearchQuery(inputValue);
        setPage("1"); // Reset to first page on new search
      }
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, searchQuery, setSearchQuery, setPage]);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["admin-users", pageNumber, searchQuery, sortBy, sortOrder],
    queryFn: async () => {
      try {
        const result = await getUsersAction({
          page: pageNumber,
          limit: 100,
          search: searchQuery || undefined,
          sortBy: sortBy as SortableColumn,
          sortOrder: sortOrder as OrderableColumn,
        });
        return result;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    initialData: initialUsers,
  });

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    [], // No dependencies, setInputValue is stable
  );

  const handleSort = useCallback(
    (column: SortableColumn) => {
      if (sortBy === column) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(column);
        setSortOrder("desc");
      }
      setPage("1");
    },
    [sortBy, sortOrder, setSortBy, setSortOrder, setPage],
  );

  const renderSortIndicator = (column: SortableColumn) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? <ArrowUp className="ml-1 inline h-4 w-4" /> : <ArrowDown className="ml-1 inline h-4 w-4" />;
  };

  const handleImpersonate = async (targetUserId: string) => {
    setImpersonatingUserId(targetUserId);
    try {
      const impersonatedSession = await authClient.admin.impersonateUser({
        userId: targetUserId,
      });

      if (impersonatedSession && !impersonatedSession.error) {
        // Success: Reload to apply the new session
        window.location.reload();
      } else {
        console.error("Erreur d'impersonnalisation:", impersonatedSession?.error);
        alert(`Erreur d'impersonnalisation: ${impersonatedSession?.error?.message || "Une erreur est survenue."}`);
      }
    } catch (error) {
      console.error("Exception lors de l'impersonnalisation:", error);
      alert("Une exception est survenue lors de l'impersonnalisation.");
    } finally {
      setImpersonatingUserId(null);
    }
  };

  // Early return for initial loading or critical error before data structure is available
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tous les utilisateurs</h2>
          <Skeleton className="w-sm h-10 max-w-sm" />
        </div>
        <div className="rounded-md border p-4">
          <Skeleton className="mb-4 h-8 w-full" />
          <Skeleton className="mb-4 h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }

  if (isError && !data?.data) {
    return (
      <div className="border-destructive bg-destructive/10 space-y-4 rounded-md border p-4">
        <div className="text-destructive flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5" />
          <h3 className="text-lg font-semibold">Erreur de chargement des utilisateurs</h3>
        </div>
        <p className="text-destructive/80 text-sm">
          Impossible de récupérer la liste des utilisateurs. Veuillez réessayer plus tard. ({error?.message || "Erreur inconnue"})
        </p>
      </div>
    );
  }

  // This check can be removed if the above error/loading states are sufficient
  // or adjusted if data.data could be null even after successful fetch with no users.
  if (!data || !data.data) {
    // This case should ideally be handled by the error state or empty data state below
    // but kept as a fallback.
    return <p>Aucune donnée disponible ou erreur de chargement.</p>;
  }

  const totalPages = data.data.pagination.pages || 1;
  const tableIsEffectivelyLoading = isFetching; // Use isFetching for background updates
  const usersToDisplay = data.data.users || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tous les utilisateurs</h2>
        <Input className="max-w-sm" onChange={handleSearchInputChange} placeholder="Rechercher par ID ou email..." value={inputValue} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead className="hover:bg-muted/50 cursor-pointer" onClick={() => handleSort("email")}>
                Email
                {renderSortIndicator("email")}
              </TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Vérifié</TableHead>
              <TableHead className="hover:bg-muted/50 cursor-pointer" onClick={() => handleSort("createdAt")}>
                Créé le
                {renderSortIndicator("createdAt")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableIsEffectivelyLoading && usersToDisplay.length === 0 ? ( // Show skeleton rows if loading and no users yet
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError && usersToDisplay.length === 0 ? ( // Show specific error in table if fetch failed
              <TableRow>
                <TableCell className="text-destructive py-4 text-center" colSpan={7}>
                  <div className="flex items-center justify-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    <span>Erreur lors du chargement des données.</span>
                  </div>
                  <p className="text-muted-foreground text-xs">{error?.message}</p>
                </TableCell>
              </TableRow>
            ) : !tableIsEffectivelyLoading && usersToDisplay.length === 0 ? (
              <TableRow>
                <TableCell className="py-4 text-center" colSpan={7}>
                  Aucun utilisateur trouvé.
                </TableCell>
              </TableRow>
            ) : (
              usersToDisplay.map((user) => (
                <TableRow className={tableIsEffectivelyLoading ? "opacity-50" : ""} key={user.id}>
                  <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                  <TableCell>{`${user.firstName || ""} ${user.lastName || ""}`.trim() || "-"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.emailVerified ? <span className="text-green-600">✓</span> : <span className="text-red-600">✗</span>}
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      disabled={impersonatingUserId === user.id}
                      onClick={() => handleImpersonate(user.id)}
                      size="small"
                      title={`Impersonnaliser ${user.firstName || ""} ${user.lastName || ""}`}
                      variant="outline"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      {impersonatingUserId === user.id ? "Chargement..." : "Impersonnaliser"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={pageNumber <= 1 ? "pointer-events-none opacity-50" : ""}
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  if (pageNumber > 1) setPage((pageNumber - 1).toString());
                }}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === pageNumber}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      setPage(p.toString());
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                className={pageNumber >= totalPages ? "pointer-events-none opacity-50" : ""}
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  if (pageNumber < totalPages) setPage((pageNumber + 1).toString());
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
