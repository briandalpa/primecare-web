import { Controller, type Control, type UseFieldArrayReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldError } from '@/components/ui/field'
import { Plus, Trash2 } from 'lucide-react'

type ManualItemValues = { name: string; quantity: number; unitPrice: number }

type Props = {
  control: Control<{ manualItems: ManualItemValues[]; [key: string]: unknown }>
  fields: UseFieldArrayReturn<{ manualItems: ManualItemValues[] }, 'manualItems'>['fields']
  append: (value: ManualItemValues) => void
  remove: (index: number) => void
  errors?: Record<string, { message?: string }>[]
}

const ManualOrderItemRows = ({ control, fields, append, remove, errors }: Props) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h3 className="text-sm font-medium text-foreground">Manual Priced Items</h3>
        <p className="text-xs text-muted-foreground">
          Use this for bedcover, sprei kasur, or other non-kilo laundry items.
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ name: '', quantity: 1, unitPrice: 0 })}
      >
        <Plus className="mr-1 h-4 w-4" /> Add Manual
      </Button>
    </div>

    {fields.map((field, index) => (
      <div key={field.id} className="grid gap-2 md:grid-cols-[1fr_96px_140px_40px]">
        <Field data-invalid={!!errors?.[index]?.name}>
          <Controller
            control={control}
            name={`manualItems.${index}.name`}
            render={({ field: f }) => <Input placeholder="e.g. Bedcover" {...f} />}
          />
          <FieldError errors={[errors?.[index]?.name]} />
        </Field>

        <Field data-invalid={!!errors?.[index]?.quantity}>
          <Controller
            control={control}
            name={`manualItems.${index}.quantity`}
            render={({ field: f }) => (
              <Input type="number" min={1} placeholder="Qty" {...f} />
            )}
          />
          <FieldError errors={[errors?.[index]?.quantity]} />
        </Field>

        <Field data-invalid={!!errors?.[index]?.unitPrice}>
          <Controller
            control={control}
            name={`manualItems.${index}.unitPrice`}
            render={({ field: f }) => (
              <Input type="number" min={1} placeholder="Unit price" {...f} />
            )}
          />
          <FieldError errors={[errors?.[index]?.unitPrice]} />
        </Field>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={() => remove(index)}
          aria-label={`Remove manual item ${index + 1}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
)

export default ManualOrderItemRows
