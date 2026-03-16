import { useUsers } from "@/hooks/useUsers"
import { useDeleteUser } from "@/hooks/useDeleteUser"
import { RoleBadge } from "./RoleBadge"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { User } from "@/types/user"

type Props = {
  search: string
  role: string
  outletId: string
  page: number
  onEdit: (user: User) => void
}

export const UserTable = ({ search, role, outletId, page, onEdit }: Props) => {

  const { data, isLoading, error, refetch } = useUsers({
    page,
    limit: 10,
    search,
    role: role === "ALL" ? undefined : role,
    outletId,
  })

  const { deleteTarget, isPending, confirmDelete, cancelDelete, handleDelete } =
    useDeleteUser(refetch)

  if (isLoading) {
    return <div className="text-muted-foreground">Loading users...</div>
  }

  if (error) {
    return <div className="text-destructive">Failed to load users</div>
  }

  const users: User[] = data?.data ?? []
  const total = data?.data?.length ?? 0
  const totalPages = Math.ceil(total / 10)

  return (
    <>
      <Card>
        <CardContent className="p-0">

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Outlet</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}

              {users.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell><RoleBadge role={user.role} /></TableCell>
                  <TableCell>{user.outlet?.name ?? "-"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-end gap-2 p-4">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button key={i} variant="outline" size="sm">
                  {i + 1}
                </Button>
              ))}
            </div>
          )}

        </CardContent>
      </Card>

      <Dialog open={!!deleteTarget} onOpenChange={cancelDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
