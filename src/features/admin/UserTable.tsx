import { format } from 'date-fns'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RoleBadge } from './RoleBadge'
import type { User } from '@/types/user'

type Props = {
  users: User[]
  onEdit: (u: User) => void
  onDelete: (id: string) => void
  canDelete: boolean
}

export function UserTable({ users, onEdit, onDelete, canDelete }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Users ({users.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 md:hidden">
          {users.length === 0 && (
            <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
              No users found.
            </div>
          )}

          {users.map((user) => (
            <div key={user.id} className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{user.name}</p>
                  <p className="mt-1 break-all text-sm text-muted-foreground">{user.email}</p>
                </div>

                <RoleBadge role={user.role} />
              </div>

              <div className="mt-4 grid gap-3 text-sm">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Outlet
                  </p>
                  <p className="mt-1">{user.outlet?.name || user.outlet?.id || '\u2014'}</p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Joined
                  </p>
                  <p className="mt-1">
                    {user.createdAt ? format(new Date(user.createdAt), 'dd MMM yyyy') : '\u2014'}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => onEdit(user)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>

                {canDelete && (
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => onDelete(user.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Name</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Role</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground hidden md:table-cell">Outlet</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground hidden lg:table-cell">Joined</th>
                <th className="pb-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium">{user.name}</td>
                  <td className="py-3 pr-4 hidden sm:table-cell text-muted-foreground">{user.email}</td>
                  <td className="py-3 pr-4"><RoleBadge role={user.role} /></td>
                  <td className="py-3 pr-4 hidden md:table-cell text-muted-foreground">
                    {user.outlet?.name || user.outlet?.id || '\u2014'}
                  </td>
                  <td className="py-3 pr-4 hidden lg:table-cell text-muted-foreground">
                    {user.createdAt ? format(new Date(user.createdAt), 'dd MMM yyyy') : '\u2014'}
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(user)} aria-label="Edit user">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onDelete(user.id)}
                          aria-label="Delete user"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
