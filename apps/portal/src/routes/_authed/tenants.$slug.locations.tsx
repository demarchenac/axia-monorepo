import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@talvu/db'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@talvu/ui/components/card'
import { Badge } from '@talvu/ui/components/badge'
import { Input } from '@talvu/ui/components/input'
import { Label } from '@talvu/ui/components/label'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@talvu/ui/components/table'
import {
  ArrowLeft, MapPin, Plus, Star, Phone, Clock, Pencil, Trash2, X,
} from 'lucide-react'

export const Route = createFileRoute('/_authed/tenants/$slug/locations')({
  component: LocationsPage,
})

type LocationForm = {
  name: string
  slug: string
  isPrimary: boolean
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  phone: string
  whatsappNumber: string
  email: string
  timezone: string
  googlePlaceId: string
  instagramHandle: string
  facebookPageUrl: string
  openingHours: HourEntry[]
}

type HourEntry = {
  dayOfWeek: string
  opens: string
  closes: string
  lunchFrom: string
  lunchTo: string
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
const DAY_LABELS: Record<string, string> = {
  Monday: 'Lun', Tuesday: 'Mar', Wednesday: 'Mié', Thursday: 'Jue',
  Friday: 'Vie', Saturday: 'Sáb', Sunday: 'Dom',
}

const emptyForm: LocationForm = {
  name: '', slug: '', isPrimary: false,
  street: '', city: '', state: '', country: 'CO', postalCode: '',
  phone: '', whatsappNumber: '', email: '',
  timezone: 'America/Bogota', googlePlaceId: '', instagramHandle: '', facebookPageUrl: '',
  openingHours: DAYS.slice(0, 6).map(d => ({
    dayOfWeek: d, opens: '08:00', closes: '18:00', lunchFrom: '', lunchTo: '',
  })),
}

function LocationsPage() {
  const { slug } = Route.useParams()
  const tenant = useQuery(api.tenants.getBySlug, { slug })
  const locations = useQuery(api.locations.listByTenant, tenant ? { tenantId: tenant._id } : 'skip')
  const createLoc = useMutation(api.locations.create)
  const updateLoc = useMutation(api.locations.update)
  const removeLoc = useMutation(api.locations.remove)

  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState<LocationForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  if (!tenant || locations === undefined) {
    return <div className="p-8 text-sm text-muted-foreground">Cargando...</div>
  }

  function startNew() {
    setForm(emptyForm)
    setEditing('new')
  }

  function startEdit(loc: any) {
    setForm({
      name: typeof loc.name === 'object' ? loc.name.es ?? '' : loc.name,
      slug: loc.slug,
      isPrimary: loc.isPrimary,
      street: loc.address.street,
      city: loc.address.city,
      state: loc.address.state ?? '',
      country: loc.address.country,
      postalCode: loc.address.postalCode ?? '',
      phone: loc.phone ?? '',
      whatsappNumber: loc.whatsappNumber ?? '',
      email: loc.email ?? '',
      timezone: loc.timezone,
      googlePlaceId: loc.googlePlaceId ?? '',
      instagramHandle: loc.instagramHandle ?? '',
      facebookPageUrl: loc.facebookPageUrl ?? '',
      openingHours: DAYS.map(d => {
        const h = loc.openingHours?.find((oh: any) => oh.dayOfWeek === d)
        return {
          dayOfWeek: d,
          opens: h?.opens ?? '',
          closes: h?.closes ?? '',
          lunchFrom: h?.closedForLunch?.from ?? '',
          lunchTo: h?.closedForLunch?.to ?? '',
        }
      }),
    })
    setEditing(loc._id)
  }

  async function handleSave() {
    if (!tenant) return
    setSaving(true)

    const hours = form.openingHours
      .filter(h => h.opens && h.closes)
      .map(h => ({
        dayOfWeek: h.dayOfWeek as any,
        opens: h.opens,
        closes: h.closes,
        ...(h.lunchFrom && h.lunchTo ? { closedForLunch: { from: h.lunchFrom, to: h.lunchTo } } : {}),
      }))

    const payload = {
      name: { es: form.name },
      slug: form.slug,
      isPrimary: form.isPrimary,
      address: {
        street: form.street,
        city: form.city,
        ...(form.state ? { state: form.state } : {}),
        country: form.country,
        ...(form.postalCode ? { postalCode: form.postalCode } : {}),
      },
      phone: form.phone || undefined,
      whatsappNumber: form.whatsappNumber || undefined,
      email: form.email || undefined,
      openingHours: hours,
      timezone: form.timezone,
      googlePlaceId: form.googlePlaceId || undefined,
      instagramHandle: form.instagramHandle || undefined,
      facebookPageUrl: form.facebookPageUrl || undefined,
    }

    try {
      if (editing === 'new') {
        await createLoc({ tenantId: tenant._id, ...payload })
      } else {
        await updateLoc({ id: editing as any, ...payload })
      }
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  function updateHour(idx: number, field: keyof HourEntry, value: string) {
    setForm(prev => ({
      ...prev,
      openingHours: prev.openingHours.map((h, i) => i === idx ? { ...h, [field]: value } : h),
    }))
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="inline size-3.5" /> Tenants
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link to="/tenants/$slug" params={{ slug }} className="text-xs text-muted-foreground hover:text-foreground">
          {tenant.name}
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-xl font-semibold tracking-tight">Ubicaciones</h1>
      </div>

      {editing ? (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm">{editing === 'new' ? 'Nueva ubicación' : 'Editar ubicación'}</CardTitle>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">
              <X className="size-4" />
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} required />
              <Field label="Slug" value={form.slug} onChange={v => setForm(p => ({ ...p, slug: v }))} required />
            </div>

            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={form.isPrimary} onChange={e => setForm(p => ({ ...p, isPrimary: e.target.checked }))} className="rounded" />
              Sede principal
            </label>

            <fieldset className="rounded-lg border p-4">
              <legend className="px-2 text-xs font-medium">Dirección</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Calle" value={form.street} onChange={v => setForm(p => ({ ...p, street: v }))} required />
                <Field label="Ciudad" value={form.city} onChange={v => setForm(p => ({ ...p, city: v }))} required />
                <Field label="Departamento" value={form.state} onChange={v => setForm(p => ({ ...p, state: v }))} />
                <Field label="País" value={form.country} onChange={v => setForm(p => ({ ...p, country: v }))} required />
                <Field label="Código postal" value={form.postalCode} onChange={v => setForm(p => ({ ...p, postalCode: v }))} />
                <Field label="Zona horaria" value={form.timezone} onChange={v => setForm(p => ({ ...p, timezone: v }))} required />
              </div>
            </fieldset>

            <fieldset className="rounded-lg border p-4">
              <legend className="px-2 text-xs font-medium">Contacto</legend>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Teléfono" value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} />
                <Field label="WhatsApp" value={form.whatsappNumber} onChange={v => setForm(p => ({ ...p, whatsappNumber: v }))} />
                <Field label="Email" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} />
              </div>
            </fieldset>

            <fieldset className="rounded-lg border p-4">
              <legend className="px-2 text-xs font-medium">Horarios</legend>
              <div className="space-y-2">
                {form.openingHours.map((h, i) => (
                  <div key={h.dayOfWeek} className="flex items-center gap-2">
                    <span className="w-8 text-xs font-medium">{DAY_LABELS[h.dayOfWeek]}</span>
                    <Input
                      type="time"
                      value={h.opens}
                      onChange={e => updateHour(i, 'opens', e.target.value)}
                      className="h-7 w-24 text-xs"
                    />
                    <span className="text-xs text-muted-foreground">—</span>
                    <Input
                      type="time"
                      value={h.closes}
                      onChange={e => updateHour(i, 'closes', e.target.value)}
                      className="h-7 w-24 text-xs"
                    />
                    <span className="ml-2 text-[0.6rem] text-muted-foreground">Almuerzo:</span>
                    <Input
                      type="time"
                      value={h.lunchFrom}
                      onChange={e => updateHour(i, 'lunchFrom', e.target.value)}
                      className="h-7 w-24 text-xs"
                    />
                    <span className="text-xs text-muted-foreground">—</span>
                    <Input
                      type="time"
                      value={h.lunchTo}
                      onChange={e => updateHour(i, 'lunchTo', e.target.value)}
                      className="h-7 w-24 text-xs"
                    />
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset className="rounded-lg border p-4">
              <legend className="px-2 text-xs font-medium">Redes y externos</legend>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Google Place ID" value={form.googlePlaceId} onChange={v => setForm(p => ({ ...p, googlePlaceId: v }))} />
                <Field label="Instagram" value={form.instagramHandle} onChange={v => setForm(p => ({ ...p, instagramHandle: v }))} placeholder="@handle" />
                <Field label="Facebook URL" value={form.facebookPageUrl} onChange={v => setForm(p => ({ ...p, facebookPageUrl: v }))} />
              </div>
            </fieldset>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex h-8 items-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : editing === 'new' ? 'Crear ubicación' : 'Guardar'}
              </button>
              <button
                onClick={() => setEditing(null)}
                className="inline-flex h-8 items-center rounded-md border px-4 text-xs font-medium transition-colors hover:bg-muted"
              >
                Cancelar
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <button
              onClick={startNew}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="size-3.5" /> Nueva ubicación
            </button>
          </div>

          {locations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MapPin className="mx-auto mb-3 size-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No hay ubicaciones aún.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Ciudad</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Horario</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-20" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.map(loc => {
                      const name = typeof loc.name === 'object' ? (loc.name as any).es ?? '' : loc.name
                      const hoursSummary = loc.openingHours?.length
                        ? `${loc.openingHours.length} días`
                        : 'Sin horario'
                      return (
                        <TableRow key={loc._id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{name}</span>
                              {loc.isPrimary && (
                                <Star className="size-3 fill-amber-400 text-amber-400" />
                              )}
                            </div>
                            <span className="text-[0.6rem] text-muted-foreground">{loc.address.street}</span>
                          </TableCell>
                          <TableCell className="text-xs">{loc.address.city}</TableCell>
                          <TableCell className="text-xs">
                            {loc.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="size-3 text-muted-foreground" />
                                {loc.phone}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="size-3" /> {hoursSummary}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={loc.active
                              ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
                              : 'bg-gray-500/20 text-gray-500 border-gray-500/30'
                            }>
                              {loc.active ? 'activa' : 'inactiva'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <button
                                onClick={() => startEdit(loc)}
                                className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              >
                                <Pencil className="size-3.5" />
                              </button>
                              <button
                                onClick={() => { if (confirm('¿Eliminar esta ubicación?')) removeLoc({ id: loc._id }) }}
                                className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean
}) {
  return (
    <div>
      <Label className="mb-1.5 text-xs">{label}</Label>
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  )
}
