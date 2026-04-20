import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteUser } from '@/services/adminUser'

export const useDeleteUser = (onSuccess: () => void) => {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast.success('User deleted successfully')
      setDeleteTarget(null)
      onSuccess()
    },
    onError: () => {
      toast.error('Failed to delete user')
    },
  })

  return {
    deleteTarget,
    isPending: mutation.isPending,
    confirmDelete: (id: string) => setDeleteTarget(id),
    cancelDelete: () => setDeleteTarget(null),
    handleDelete: () => { if (deleteTarget) mutation.mutate(deleteTarget) },
  }
}
