import { useQuery } from "@tanstack/react-query"
import { getUsers } from "@/services/adminUser"
import type { GetUsersParams } from "@/services/adminUser"

export const useUsers = (params: GetUsersParams) => {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => getUsers(params),
  })
}