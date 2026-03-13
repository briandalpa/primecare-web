import { useState } from "react"
import { UserTable } from "@/components/users/UserTable"
import { UserFilters } from "@/components/users/UserFilters"

export const UsersPage = () => {

  const [search, setSearch] = useState("")
  const [role, setRole] = useState("ALL")
  const [outletId, setOutletId] = useState("")
  const [page] = useState(1)

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-semibold">
          Users
        </h1>

        <p className="text-muted-foreground">
          Manage system users
        </p>
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
      />

    </div>
  )
}