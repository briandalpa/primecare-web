import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  search: string
  role: string
  outletId: string
  onSearchChange: (value: string) => void
  onRoleChange: (value: string) => void
  onOutletChange: (value: string) => void
}

export const UserFilters = ({
  search,
  role,
  outletId,
  onSearchChange,
  onRoleChange,
  onOutletChange,
}: Props) => {
  return (
    <div className="flex gap-4 flex-wrap">

      {/* Search */}
      <Input
        placeholder="Search name..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />

      {/* Role Filter */}
      <Select value={role} onValueChange={onRoleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter role" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All Roles</SelectItem>
          <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
          <SelectItem value="OUTLET_ADMIN">Outlet Admin</SelectItem>
          <SelectItem value="WORKER">Worker</SelectItem>
          <SelectItem value="DRIVER">Driver</SelectItem>
        </SelectContent>
      </Select>

      {/* Outlet Filter */}
      <Input
        placeholder="Outlet ID"
        value={outletId}
        onChange={(e) => onOutletChange(e.target.value)}
        className="max-w-xs"
      />

    </div>
  )
}