import { Badge } from "@/components/ui/badge"

type Props = {
  role: string
}

export const RoleBadge = ({ role }: Props) => {
  const getVariant = () => {
    switch (role) {
      case "SUPER_ADMIN":
        return "destructive"
      case "OUTLET_ADMIN":
        return "default"
      case "WORKER":
        return "secondary"
      case "DRIVER":
        return "outline"
      default:
        return "secondary"
    }
  }

  return <Badge variant={getVariant()}>{role}</Badge>
}
