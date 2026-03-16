import { useState } from "react"
import { UserTable } from "@/features/users/UserTable"
import { UserFilters } from "@/features/users/UserFilters"
import { UserFormModal } from "@/features/users/UserFormModal"
import { Button } from "@/components/ui/button"
import type { User } from "@/types/user"

export const UsersPage = () => {

  const [search, setSearch] = useState("")
  const [role, setRole] = useState("ALL")
  const [outletId, setOutletId] = useState("")
  const [page] = useState(1)

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null)
  const [editTarget, setEditTarget] = useState<User | null>(null)

  const openCreate = () => setModalMode("create")
  const openEdit = (user: User) => { setEditTarget(user); setModalMode("edit") }
  const closeModal = () => { setModalMode(null); setEditTarget(null) }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-muted-foreground">Manage system users</p>
        </div>
        <Button onClick={openCreate}>Create User</Button>
      </div>

      <UserFilters
        search={search}
        role={role}
        outletId={outletId}
        onSearchChange={setSearch}
        onRoleChange={setRole}
        onOutletChange={setOutletId}
      />

      <UserTable
        search={search}
        role={role}
        outletId={outletId}
        page={page}
        onEdit={openEdit}
      />

      {modalMode === "create" && (
        <UserFormModal
          key="create"
          mode="create"
          open
          onClose={closeModal}
          onSuccess={closeModal}
        />
      )}

      {modalMode === "edit" && editTarget && (
        <UserFormModal
          key={editTarget.id}
          mode="edit"
          user={editTarget}
          open
          onClose={closeModal}
          onSuccess={closeModal}
        />
      )}

    </div>
  )
}
