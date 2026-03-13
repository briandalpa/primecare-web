import { useUsers } from "@/hooks/useUsers"
import { RoleBadge } from "./RoleBadge"

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

  const { data, isLoading, error } = useUsers({
    page,
    limit: 10,
    search,
    role: role === "ALL" ? undefined : role,
    outletId,
  })

  if (isLoading) {
    return <div className="text-muted-foreground">Loading users...</div>
  }

  if (error) {
    return <div className="text-destructive">Failed to load users</div>
  }

  const users: User[] = data?.data ?? []

  const total = data?.meta?.total ?? 0
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
            {users.map((user) => (
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

                <TableCell className="text-right">
                  Edit
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
                className="px-3 py-1 border rounded text-sm"
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