import { useUsers } from "@/hooks/useUsers"
import { RoleBadge } from "./RoleBadge"

import { deleteUser } from "@/services/adminUser"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { User } from "@/services/adminUser"

type Props = {
  search: string
  role: string
  outletId: string
  page: number
}

export const UserTable = ({ search, role, outletId, page }: Props) => {

  const { data, isLoading, error, refetch } = useUsers({
    page,
    limit: 10,
    search,
    role: role === "ALL" ? undefined : role,
    outletId,
  })

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?")
    if (!confirmed) return

    try {
      await deleteUser(id)
      toast.success("User deleted successfully")
      refetch()
    } catch {
      toast.error("Failed to delete user")
    }
  }

  if (isLoading) {
    return (
      <div className="text-muted-foreground">
        Loading users...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-destructive">
        Failed to load users
      </div>
    )
  }

  const users: User[] = data?.data ?? []

  const total = users.length
  const totalPages = Math.ceil(total / 10)

  return (
    <Card>
      <CardContent className="p-0">

        <Table>

          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Outlet</TableHead>
              <TableHead className="text-right">Action</TableHead>
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

                <TableCell className="font-medium">
                  {user.name}
                </TableCell>

                <TableCell>
                  {user.email}
                </TableCell>

                <TableCell>
                  <RoleBadge role={user.role} />
                </TableCell>

                <TableCell>
                  {user.outlet?.name ?? "-"}
                </TableCell>

                <TableCell className="text-right space-x-3">

                  <button
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>

                </TableCell>

              </TableRow>
            ))}

          </TableBody>

        </Table>

        {totalPages > 1 && (
          <div className="flex justify-end gap-2 p-4">

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className="px-3 py-1 border rounded text-sm hover:bg-muted"
              >
                {i + 1}
              </button>
            ))}

          </div>
        )}

      </CardContent>
    </Card>
  )
}