import { Controller, type Control, type UseFieldArrayReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldError } from '@/components/ui/field'
import { Plus, Trash2 } from 'lucide-react'
import { useLaundryItems } from '@/hooks/useLaundryItems'

type ItemValues = { laundryItemId: string; quantity: number }

type Props = {
  control: Control<{ items: ItemValues[]; [key: string]: unknown }>
  fields: UseFieldArrayReturn<{ items: ItemValues[] }, 'items'>['fields']
  append: (value: ItemValues) => void
  remove: (index: number) => void
  errors?: Record<string, { message?: string }>[]
}

const OrderItemRows = ({ control, fields, append, remove, errors }: Props) => {
  const { data, isPending } = useLaundryItems()
  const items = data?.data ?? []

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Laundry Items</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ laundryItemId: '', quantity: 1 })}
        >
          <Plus className="mr-1 h-4 w-4" /> Add Item
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-2">
          <Field className="flex-1" data-invalid={!!errors?.[index]?.laundryItemId}>
            <Controller
              control={control}
              name={`items.${index}.laundryItemId`}
              render={({ field: f }) => (
                <Select onValueChange={f.onChange} value={f.value}>
                  <SelectTrigger>
                    <SelectValue placeholder={isPending ? 'Loading...' : 'Select item'} />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors?.[index]?.laundryItemId]} />
          </Field>

          <Field className="w-20" data-invalid={!!errors?.[index]?.quantity}>
            <Controller
              control={control}
              name={`items.${index}.quantity`}
              render={({ field: f }) => (
                <Input
                  type="number"
                  min={1}
                  placeholder="Qty"
                  value={f.value}
                  onChange={(e) => f.onChange(Number(e.target.value))}
                />
              )}
            />
            <FieldError errors={[errors?.[index]?.quantity]} />
          </Field>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mt-0.5 shrink-0 text-destructive hover:text-destructive"
            disabled={fields.length <= 1}
            onClick={() => remove(index)}
            aria-label={`Remove item ${index + 1}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

export default OrderItemRows
