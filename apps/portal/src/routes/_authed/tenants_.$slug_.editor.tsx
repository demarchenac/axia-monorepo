import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@talvu/db'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@talvu/ui/components/card'
import { Badge } from '@talvu/ui/components/badge'
import {
  ArrowLeft, Plus, ChevronUp, ChevronDown, Eye, EyeOff, Pencil,
  Trash2, X, Loader2, Check, Monitor, Tablet, Smartphone,
  LayoutTemplate, GripVertical, Paintbrush, RotateCcw, ImagePlus, Upload,
} from 'lucide-react'
import { SECTION_CATALOG } from '@talvu/blocks/sections/catalog'
import { resolve } from '@talvu/blocks/lib/content-helpers'

export const Route = createFileRoute('/_authed/tenants_/$slug_/editor')({
  component: EditorPage,
})

const sectionTypeIcons: Record<string, string> = {
  header: '🧭',
  hero: '🖼️',
  services: '⚕️',
  team: '👥',
  testimonials: '💬',
  stats: '📊',
  'cta-contact': '📞',
  footer: '🔻',
}

const previewWidths = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
} as const

type PreviewDevice = keyof typeof previewWidths

function EditorPage() {
  const { slug } = Route.useParams()
  const tenant = useQuery(api.tenants.getBySlug, { slug })
  const page = useQuery(api.pages.getByTenant, tenant ? { tenantId: tenant._id } : 'skip')

  const createPage = useMutation(api.pages.createPage)
  const upsertSection = useMutation(api.pages.upsertSection)
  const reorderSections = useMutation(api.pages.reorderSections)
  const toggleVisibility = useMutation(api.pages.toggleVisibility)
  const deleteSection = useMutation(api.pages.deleteSection)

  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [addingSection, setAddingSection] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop')

  if (!tenant || page === undefined) {
    return <div className="p-8 text-sm text-muted-foreground">Cargando...</div>
  }

  const sections = page?.sections ?? []

  async function handleCreatePage() {
    if (!tenant) return
    await createPage({ tenantId: tenant._id })
  }

  async function handleAddSection(type: string, variant: string) {
    if (!page) return
    const defaultContent = getDefaultContent(type)
    await upsertSection({
      pageId: page._id,
      type,
      variant,
      order: sections.length,
      content: defaultContent,
      visible: true,
    })
    setAddingSection(false)
  }

  async function handleMoveUp(index: number) {
    if (index === 0) return
    const ids = sections.map((s: any) => s._id)
    ;[ids[index - 1], ids[index]] = [ids[index], ids[index - 1]]
    await reorderSections({ sectionIds: ids })
  }

  async function handleMoveDown(index: number) {
    if (index === sections.length - 1) return
    const ids = sections.map((s: any) => s._id)
    ;[ids[index], ids[index + 1]] = [ids[index + 1], ids[index]]
    await reorderSections({ sectionIds: ids })
  }

  async function handleDelete(sectionId: string) {
    if (!confirm('¿Eliminar esta sección?')) return
    await deleteSection({ sectionId: sectionId as any })
    if (editingSection === sectionId) setEditingSection(null)
  }

  return (
    <div className="flex h-full">
      {/* Left panel — section list */}
      <div className="w-[480px] shrink-0 overflow-y-auto border-r p-6">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="inline size-3.5" /> Tenants
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            to="/tenants/$slug"
            params={{ slug }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {tenant.name}
          </Link>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-lg font-semibold tracking-tight">Editor</h1>
        </div>

        {!page ? (
          <Card>
            <CardContent className="py-12 text-center">
              <LayoutTemplate className="mx-auto mb-3 size-8 text-muted-foreground/30" />
              <p className="mb-4 text-sm text-muted-foreground">
                Este tenant no tiene una página creada.
              </p>
              <button
                onClick={handleCreatePage}
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="size-3.5" /> Crear página
              </button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Section list */}
            <div className="space-y-2">
              {sections.map((section: any, index: number) => {
                const catalogEntry = SECTION_CATALOG.find((c) => c.type === section.type)
                const label = catalogEntry
                  ? resolve(catalogEntry.label, 'es')
                  : section.type

                return (
                  <div
                    key={section._id}
                    className={`group flex items-center gap-2 rounded-lg border p-3 transition-colors ${
                      editingSection === section._id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-foreground/20'
                    } ${!section.visible ? 'opacity-50' : ''}`}
                  >
                    <GripVertical className="size-4 shrink-0 text-muted-foreground/40" />

                    <span className="text-base">{sectionTypeIcons[section.type] ?? '📄'}</span>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-[0.65rem] text-muted-foreground">
                        {section.variant}
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      <IconButton
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        title="Subir"
                      >
                        <ChevronUp className="size-3.5" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleMoveDown(index)}
                        disabled={index === sections.length - 1}
                        title="Bajar"
                      >
                        <ChevronDown className="size-3.5" />
                      </IconButton>
                      <IconButton
                        onClick={() => toggleVisibility({ sectionId: section._id })}
                        title={section.visible ? 'Ocultar' : 'Mostrar'}
                      >
                        {section.visible ? (
                          <Eye className="size-3.5" />
                        ) : (
                          <EyeOff className="size-3.5" />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          setEditingSection(
                            editingSection === section._id ? null : section._id,
                          )
                        }
                        title="Editar contenido"
                        active={editingSection === section._id}
                      >
                        <Pencil className="size-3.5" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(section._id)}
                        title="Eliminar"
                        destructive
                      >
                        <Trash2 className="size-3.5" />
                      </IconButton>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Add section */}
            {addingSection ? (
              <AddSectionPicker
                onSelect={handleAddSection}
                onCancel={() => setAddingSection(false)}
              />
            ) : (
              <button
                onClick={() => setAddingSection(true)}
                className="mt-4 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-dashed text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                <Plus className="size-3.5" /> Agregar sección
              </button>
            )}

            {/* Section content editor */}
            {editingSection && (
              <SectionEditor
                section={sections.find((s: any) => s._id === editingSection)}
                onClose={() => setEditingSection(null)}
              />
            )}

            {/* Design token editor */}
            {tenant && <TokenEditor tenantId={tenant._id} />}

            {/* Image manager */}
            {tenant && <ImageManager tenantId={tenant._id} />}
          </>
        )}
      </div>

      {/* Right panel — live preview */}
      <div className="flex-1 flex flex-col bg-muted/30">
        <div className="flex items-center justify-between border-b bg-background px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">Vista previa</span>
          <div className="flex gap-1">
            {(Object.keys(previewWidths) as PreviewDevice[]).map((device) => {
              const Icon = device === 'desktop' ? Monitor : device === 'tablet' ? Tablet : Smartphone
              return (
                <button
                  key={device}
                  onClick={() => setPreviewDevice(device)}
                  className={`inline-flex size-7 items-center justify-center rounded-md transition-colors ${
                    previewDevice === device
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="size-3.5" />
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 flex items-start justify-center overflow-auto p-4">
          <div
            className="h-full bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
            style={{ width: previewWidths[previewDevice], maxWidth: '100%' }}
          >
            <iframe
              src={`http://localhost:3000/t/${slug}`}
              className="h-full w-full border-0"
              title="Landing preview"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function AddSectionPicker({
  onSelect,
  onCancel,
}: {
  onSelect: (type: string, variant: string) => void
  onCancel: () => void
}) {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const catalogEntry = selectedType
    ? SECTION_CATALOG.find((c) => c.type === selectedType)
    : null

  return (
    <Card className="mt-4">
      <CardHeader className="flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm">
          {selectedType ? 'Elegir variante' : 'Agregar sección'}
        </CardTitle>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </button>
      </CardHeader>
      <CardContent>
        {!selectedType ? (
          <div className="grid grid-cols-2 gap-2">
            {SECTION_CATALOG.map((entry) => (
              <button
                key={entry.type}
                onClick={() => setSelectedType(entry.type)}
                className="flex items-center gap-2.5 rounded-md border p-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
              >
                <span className="text-lg">{sectionTypeIcons[entry.type] ?? '📄'}</span>
                <div>
                  <div className="text-xs font-medium">{resolve(entry.label, 'es')}</div>
                  <div className="text-[0.6rem] text-muted-foreground">
                    {resolve(entry.description, 'es')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => setSelectedType(null)}
              className="mb-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="inline size-3" /> Volver
            </button>
            <div className="grid grid-cols-2 gap-2">
              {catalogEntry?.availableVariants.map((variant) => (
                <button
                  key={variant}
                  onClick={() => onSelect(selectedType, variant)}
                  className="rounded-md border p-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <div className="text-xs font-medium capitalize">{variant}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SectionEditor({
  section,
  onClose,
}: {
  section: any
  onClose: () => void
}) {
  const updateContent = useMutation(api.pages.updateSectionContent)
  const updateVariant = useMutation(api.pages.updateSectionVariant)
  const [content, setContent] = useState<any>(() =>
    JSON.parse(JSON.stringify(section.content)),
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const catalogEntry = SECTION_CATALOG.find((c) => c.type === section.type)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await updateContent({ sectionId: section._id, content })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  async function handleVariantChange(variant: string) {
    await updateVariant({ sectionId: section._id, variant })
  }

  return (
    <Card className="mt-4">
      <CardHeader className="flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-sm">
            {sectionTypeIcons[section.type] ?? '📄'}{' '}
            {catalogEntry ? resolve(catalogEntry.label, 'es') : section.type}
          </CardTitle>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[0.65rem] text-muted-foreground">Variante:</span>
            <select
              value={section.variant}
              onChange={(e) => handleVariantChange(e.target.value)}
              className="h-6 rounded border bg-transparent px-1.5 text-[0.65rem] outline-none"
            >
              {catalogEntry?.availableVariants.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </button>
      </CardHeader>
      <CardContent className="space-y-3">
        <ContentForm
          type={section.type}
          content={content}
          onChange={setContent}
        />
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-8 items-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? (
              <><Loader2 className="mr-1.5 size-3 animate-spin" /> Guardando...</>
            ) : (
              'Guardar'
            )}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <Check className="size-3" /> Guardado
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// --- Content form dispatcher (Phase 4 will expand these) ---

function ContentForm({
  type,
  content,
  onChange,
}: {
  type: string
  content: any
  onChange: (c: any) => void
}) {
  switch (type) {
    case 'header':
      return <HeaderForm content={content} onChange={onChange} />
    case 'hero':
      return <HeroForm content={content} onChange={onChange} />
    case 'services':
      return <ServicesForm content={content} onChange={onChange} />
    case 'team':
      return <TeamForm content={content} onChange={onChange} />
    case 'testimonials':
      return <TestimonialsForm content={content} onChange={onChange} />
    case 'stats':
      return <StatsForm content={content} onChange={onChange} />
    case 'cta-contact':
      return <CtaForm content={content} onChange={onChange} />
    case 'footer':
      return <FooterForm content={content} onChange={onChange} />
    default:
      return (
        <div className="text-xs text-muted-foreground">
          Editor no disponible para este tipo de sección.
        </div>
      )
  }
}

// --- Shared form primitives ---

function I18nInput({
  label,
  value,
  onChange,
  locale = 'es',
  multiline,
}: {
  label: string
  value: Record<string, string>
  onChange: (v: Record<string, string>) => void
  locale?: string
  multiline?: boolean
}) {
  const InputEl = multiline ? 'textarea' : 'input'
  return (
    <div>
      <label className="mb-1 block text-[0.65rem] font-medium text-muted-foreground">
        {label}
      </label>
      <InputEl
        value={value?.[locale] ?? ''}
        onChange={(e) => onChange({ ...value, [locale]: e.target.value })}
        className="w-full rounded-md border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
        {...(multiline ? { rows: 2 } : {})}
      />
    </div>
  )
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-[0.65rem] font-medium text-muted-foreground">
        {label}
      </label>
      <input
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
      />
    </div>
  )
}

// --- Section-specific forms ---

function HeaderForm({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-3">
      <TextInput
        label="Nombre de la clínica"
        value={content.clinicName}
        onChange={(v) => onChange({ ...content, clinicName: v })}
      />
      <TextInput
        label="Nombre del doctor"
        value={content.doctorName ?? ''}
        onChange={(v) => onChange({ ...content, doctorName: v || undefined })}
      />
      <I18nInput
        label="Texto del botón (CTA)"
        value={content.ctaLabel ?? {}}
        onChange={(v) => onChange({ ...content, ctaLabel: v })}
      />
      <TextInput
        label="Enlace del botón"
        value={content.ctaHref ?? ''}
        onChange={(v) => onChange({ ...content, ctaHref: v || undefined })}
        placeholder="#contacto"
      />
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={content.overlay ?? false}
          onChange={(e) => onChange({ ...content, overlay: e.target.checked })}
          className="rounded"
        />
        Overlay sobre el fondo
      </label>
    </div>
  )
}

function HeroForm({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-3">
      <I18nInput
        label="Título"
        value={content.heading ?? {}}
        onChange={(v) => onChange({ ...content, heading: v })}
      />
      <I18nInput
        label="Título acento"
        value={content.headingAccent ?? {}}
        onChange={(v) => onChange({ ...content, headingAccent: v })}
      />
      <I18nInput
        label="Subtítulo"
        value={content.subheading ?? {}}
        onChange={(v) => onChange({ ...content, subheading: v })}
        multiline
      />
      <I18nInput
        label="Badge"
        value={content.badge ?? {}}
        onChange={(v) => onChange({ ...content, badge: v })}
      />
      <TextInput
        label="URL de imagen"
        value={content.imageUrl ?? ''}
        onChange={(v) => onChange({ ...content, imageUrl: v || undefined })}
        placeholder="https://..."
      />
      <TextInput
        label="URL de video"
        value={content.videoUrl ?? ''}
        onChange={(v) => onChange({ ...content, videoUrl: v || undefined })}
        placeholder="https://..."
      />
      <CtaListEditor
        ctas={content.ctas ?? []}
        onChange={(ctas) => onChange({ ...content, ctas })}
      />
      <PromiseCardsEditor
        cards={content.promiseCards ?? []}
        onChange={(promiseCards) => onChange({ ...content, promiseCards })}
      />
    </div>
  )
}

function ServicesForm({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-3">
      <I18nInput
        label="Eyebrow"
        value={content.eyebrow ?? {}}
        onChange={(v) => onChange({ ...content, eyebrow: v })}
      />
      <I18nInput
        label="Título"
        value={content.heading ?? {}}
        onChange={(v) => onChange({ ...content, heading: v })}
      />
      <I18nInput
        label="Subtítulo"
        value={content.subheading ?? {}}
        onChange={(v) => onChange({ ...content, subheading: v })}
        multiline
      />
      <ArrayItemsEditor
        label="Servicios"
        items={content.items ?? []}
        onChange={(items) => onChange({ ...content, items })}
        renderItem={(item, idx, updateItem) => (
          <div className="space-y-2">
            <I18nInput
              label={`Nombre #${idx + 1}`}
              value={item.name ?? {}}
              onChange={(v) => updateItem({ ...item, name: v })}
            />
            <I18nInput
              label="Descripción"
              value={item.description ?? {}}
              onChange={(v) => updateItem({ ...item, description: v })}
              multiline
            />
          </div>
        )}
        createItem={() => ({ name: { es: '' }, description: { es: '' } })}
      />
    </div>
  )
}

function TeamForm({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-3">
      <I18nInput
        label="Eyebrow"
        value={content.eyebrow ?? {}}
        onChange={(v) => onChange({ ...content, eyebrow: v })}
      />
      <I18nInput
        label="Título"
        value={content.heading ?? {}}
        onChange={(v) => onChange({ ...content, heading: v })}
      />
      <I18nInput
        label="Subtítulo"
        value={content.subheading ?? {}}
        onChange={(v) => onChange({ ...content, subheading: v })}
        multiline
      />
      <ArrayItemsEditor
        label="Miembros"
        items={content.members ?? []}
        onChange={(members) => onChange({ ...content, members })}
        renderItem={(item, idx, updateItem) => (
          <div className="space-y-2">
            <TextInput
              label={`Nombre #${idx + 1}`}
              value={item.name ?? ''}
              onChange={(v) => updateItem({ ...item, name: v })}
            />
            <I18nInput
              label="Rol"
              value={item.role ?? {}}
              onChange={(v) => updateItem({ ...item, role: v })}
            />
            <I18nInput
              label="Bio"
              value={item.bio ?? {}}
              onChange={(v) => updateItem({ ...item, bio: v })}
              multiline
            />
            <TextInput
              label="URL de foto"
              value={item.photoUrl ?? ''}
              onChange={(v) => updateItem({ ...item, photoUrl: v })}
              placeholder="https://..."
            />
          </div>
        )}
        createItem={() => ({ name: '', role: { es: '' }, bio: { es: '' }, photoUrl: '' })}
      />
    </div>
  )
}

function TestimonialsForm({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-3">
      <I18nInput
        label="Eyebrow"
        value={content.eyebrow ?? {}}
        onChange={(v) => onChange({ ...content, eyebrow: v })}
      />
      <I18nInput
        label="Título"
        value={content.heading ?? {}}
        onChange={(v) => onChange({ ...content, heading: v })}
      />
      <ArrayItemsEditor
        label="Testimonios"
        items={content.items ?? []}
        onChange={(items) => onChange({ ...content, items })}
        renderItem={(item, idx, updateItem) => (
          <div className="space-y-2">
            <TextInput
              label={`Nombre #${idx + 1}`}
              value={item.name ?? ''}
              onChange={(v) => updateItem({ ...item, name: v })}
            />
            <TextInput
              label="Ciudad"
              value={item.location ?? ''}
              onChange={(v) => updateItem({ ...item, location: v })}
            />
            <TextInput
              label="Servicio"
              value={item.service ?? ''}
              onChange={(v) => updateItem({ ...item, service: v })}
            />
            <I18nInput
              label="Texto"
              value={item.text ?? {}}
              onChange={(v) => updateItem({ ...item, text: v })}
              multiline
            />
            <div>
              <label className="mb-1 block text-[0.65rem] font-medium text-muted-foreground">
                Calificación (1-5)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={item.rating ?? 5}
                onChange={(e) => updateItem({ ...item, rating: Number(e.target.value) })}
                className="w-20 rounded-md border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring"
              />
            </div>
          </div>
        )}
        createItem={() => ({ name: '', location: '', service: '', text: { es: '' }, rating: 5 })}
      />
    </div>
  )
}

function StatsForm({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <ArrayItemsEditor
      label="Estadísticas"
      items={content.items ?? []}
      onChange={(items) => onChange({ ...content, items })}
      renderItem={(item, idx, updateItem) => (
        <div className="grid grid-cols-2 gap-2">
          <TextInput
            label={`Valor #${idx + 1}`}
            value={item.value ?? ''}
            onChange={(v) => updateItem({ ...item, value: v })}
            placeholder="1,200+"
          />
          <I18nInput
            label="Etiqueta"
            value={item.label ?? {}}
            onChange={(v) => updateItem({ ...item, label: v })}
          />
        </div>
      )}
      createItem={() => ({ value: '', label: { es: '' } })}
    />
  )
}

function CtaForm({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-3">
      <I18nInput
        label="Eyebrow"
        value={content.eyebrow ?? {}}
        onChange={(v) => onChange({ ...content, eyebrow: v })}
      />
      <TextInput
        label="Emoji"
        value={content.emoji ?? ''}
        onChange={(v) => onChange({ ...content, emoji: v })}
      />
      <I18nInput
        label="Título"
        value={content.heading ?? {}}
        onChange={(v) => onChange({ ...content, heading: v })}
      />
      <I18nInput
        label="Subtítulo"
        value={content.subheading ?? {}}
        onChange={(v) => onChange({ ...content, subheading: v })}
        multiline
      />
      <fieldset className="rounded-md border p-3">
        <legend className="px-1 text-[0.65rem] font-medium">Botón CTA</legend>
        <div className="space-y-2">
          <I18nInput
            label="Texto"
            value={content.cta?.label ?? {}}
            onChange={(v) => onChange({ ...content, cta: { ...content.cta, label: v } })}
          />
          <TextInput
            label="Enlace"
            value={content.cta?.href ?? ''}
            onChange={(v) => onChange({ ...content, cta: { ...content.cta, href: v } })}
            placeholder="#contacto"
          />
        </div>
      </fieldset>
      <ArrayItemsEditor
        label="Detalles de contacto"
        items={content.details ?? []}
        onChange={(details) => onChange({ ...content, details })}
        renderItem={(item, idx, updateItem) => (
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              label={`Ícono #${idx + 1}`}
              value={item.icon ?? ''}
              onChange={(v) => updateItem({ ...item, icon: v })}
              placeholder="📍"
            />
            <I18nInput
              label="Texto"
              value={item.text ?? {}}
              onChange={(v) => updateItem({ ...item, text: v })}
            />
          </div>
        )}
        createItem={() => ({ icon: '', text: { es: '' } })}
      />
    </div>
  )
}

function FooterForm({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-3">
      <TextInput
        label="Nombre de la clínica"
        value={content.clinicName ?? ''}
        onChange={(v) => onChange({ ...content, clinicName: v })}
      />
      <TextInput
        label="Nombre del doctor"
        value={content.doctorName ?? ''}
        onChange={(v) => onChange({ ...content, doctorName: v || undefined })}
      />
      <I18nInput
        label="Texto adicional"
        value={content.text ?? {}}
        onChange={(v) => onChange({ ...content, text: v })}
      />
    </div>
  )
}

// --- Reusable array editor ---

function ArrayItemsEditor({
  label,
  items,
  onChange,
  renderItem,
  createItem,
}: {
  label: string
  items: any[]
  onChange: (items: any[]) => void
  renderItem: (item: any, index: number, update: (item: any) => void) => React.ReactNode
  createItem: () => any
}) {
  function updateItem(index: number, newItem: any) {
    const next = [...items]
    next[index] = newItem
    onChange(next)
  }

  function removeItem(index: number) {
    onChange(items.filter((_: any, i: number) => i !== index))
  }

  function addItem() {
    onChange([...items, createItem()])
  }

  return (
    <fieldset className="rounded-md border p-3">
      <legend className="px-1 text-[0.65rem] font-medium">{label}</legend>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="relative rounded-md border border-dashed p-3">
            <button
              onClick={() => removeItem(idx)}
              className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3" />
            </button>
            {renderItem(item, idx, (newItem) => updateItem(idx, newItem))}
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="mt-2 inline-flex h-7 items-center gap-1 rounded-md border border-dashed px-2.5 text-[0.65rem] font-medium text-muted-foreground hover:text-foreground"
      >
        <Plus className="size-3" /> Agregar
      </button>
    </fieldset>
  )
}

// --- CTA list editor for Hero ---

function CtaListEditor({
  ctas,
  onChange,
}: {
  ctas: any[]
  onChange: (ctas: any[]) => void
}) {
  return (
    <ArrayItemsEditor
      label="Botones CTA"
      items={ctas}
      onChange={onChange}
      renderItem={(cta, idx, updateCta) => (
        <div className="space-y-2">
          <I18nInput
            label={`Texto #${idx + 1}`}
            value={cta.label ?? {}}
            onChange={(v) => updateCta({ ...cta, label: v })}
          />
          <TextInput
            label="Enlace"
            value={cta.href ?? ''}
            onChange={(v) => updateCta({ ...cta, href: v })}
            placeholder="#contacto"
          />
          <div>
            <label className="mb-1 block text-[0.65rem] font-medium text-muted-foreground">
              Variante
            </label>
            <select
              value={cta.variant ?? 'primary'}
              onChange={(e) => updateCta({ ...cta, variant: e.target.value })}
              className="h-7 rounded border bg-transparent px-2 text-xs outline-none"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
            </select>
          </div>
        </div>
      )}
      createItem={() => ({ label: { es: '' }, href: '#', variant: 'primary' })}
    />
  )
}

// --- Promise cards editor for Hero ---

function PromiseCardsEditor({
  cards,
  onChange,
}: {
  cards: any[]
  onChange: (cards: any[]) => void
}) {
  if (cards.length === 0) return null

  return (
    <ArrayItemsEditor
      label="Promise Cards"
      items={cards}
      onChange={onChange}
      renderItem={(card, idx, updateCard) => (
        <div className="space-y-2">
          <TextInput
            label={`Emoji #${idx + 1}`}
            value={card.emoji ?? ''}
            onChange={(v) => updateCard({ ...card, emoji: v })}
          />
          <I18nInput
            label="Título"
            value={card.title ?? {}}
            onChange={(v) => updateCard({ ...card, title: v })}
          />
          <I18nInput
            label="Descripción"
            value={card.description ?? {}}
            onChange={(v) => updateCard({ ...card, description: v })}
          />
        </div>
      )}
      createItem={() => ({ emoji: '✨', title: { es: '' }, description: { es: '' } })}
    />
  )
}

// --- Default content for new sections ---

// --- Design Token Editor ---

const TOKEN_COLOR_FIELDS = [
  { key: '--bg', label: 'Fondo' },
  { key: '--bg-alt', label: 'Fondo alterno' },
  { key: '--fg', label: 'Texto' },
  { key: '--fg-muted', label: 'Texto secundario' },
  { key: '--primary', label: 'Primario' },
  { key: '--primary-fg', label: 'Texto sobre primario' },
  { key: '--accent', label: 'Acento' },
  { key: '--accent-fg', label: 'Texto sobre acento' },
  { key: '--border', label: 'Bordes' },
  { key: '--card', label: 'Tarjeta' },
  { key: '--card-fg', label: 'Texto tarjeta' },
] as const

const FONT_OPTIONS = [
  'system-ui, sans-serif',
  "'Inter', sans-serif",
  "'Roboto', sans-serif",
  "'Poppins', sans-serif",
  "'Montserrat', sans-serif",
  "'Lora', serif",
  "'Playfair Display', serif",
  "'Merriweather', serif",
  "'DM Sans', sans-serif",
  "'Space Grotesk', sans-serif",
]

function TokenEditor({ tenantId }: { tenantId: any }) {
  const tokens = useQuery(api.designTokens.getActive, { tenantId })
  const upsertTokens = useMutation(api.designTokens.upsert)
  const [expanded, setExpanded] = useState(false)
  const [draft, setDraft] = useState<Record<string, string> | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const currentTokens = (tokens?.tokens ?? {}) as Record<string, string>
  const editTokens = draft ?? currentTokens

  function updateToken(key: string, value: string) {
    setDraft({ ...editTokens, [key]: value })
  }

  async function handleSave() {
    if (!draft) return
    setSaving(true)
    setSaved(false)
    try {
      await upsertTokens({
        tenantId,
        name: 'custom',
        tokens: draft,
        basedOnPresetSlug: tokens?.basedOnPresetSlug,
      })
      setSaved(true)
      setDraft(null)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setDraft(null)
  }

  return (
    <Card className="mt-4">
      <CardHeader
        className="flex-row items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <CardTitle className="flex items-center gap-2 text-sm">
          <Paintbrush className="size-3.5" /> Design Tokens
        </CardTitle>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4">
          {/* Colors */}
          <fieldset className="rounded-md border p-3">
            <legend className="px-1 text-[0.65rem] font-medium">Colores</legend>
            <div className="grid grid-cols-2 gap-3">
              {TOKEN_COLOR_FIELDS.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editTokens[key] ?? '#000000'}
                    onChange={(e) => updateToken(key, e.target.value)}
                    className="size-8 shrink-0 cursor-pointer rounded border bg-transparent p-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.6rem] text-muted-foreground truncate">{label}</div>
                    <input
                      value={editTokens[key] ?? ''}
                      onChange={(e) => updateToken(key, e.target.value)}
                      placeholder="#000000"
                      className="w-full rounded border border-input bg-transparent px-1.5 py-0.5 font-mono text-[0.65rem] outline-none focus-visible:border-ring"
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          {/* Border radius */}
          <fieldset className="rounded-md border p-3">
            <legend className="px-1 text-[0.65rem] font-medium">Radio de bordes</legend>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={24}
                value={parseInt(editTokens['--radius'] ?? '8', 10)}
                onChange={(e) => updateToken('--radius', `${e.target.value}px`)}
                className="flex-1"
              />
              <span className="w-12 text-right font-mono text-xs">
                {editTokens['--radius'] ?? '8px'}
              </span>
            </div>
          </fieldset>

          {/* Fonts */}
          <fieldset className="rounded-md border p-3">
            <legend className="px-1 text-[0.65rem] font-medium">Tipografía</legend>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[0.6rem] text-muted-foreground">
                  Fuente body
                </label>
                <select
                  value={editTokens['--font-body'] ?? 'system-ui, sans-serif'}
                  onChange={(e) => updateToken('--font-body', e.target.value)}
                  className="h-8 w-full rounded border bg-transparent px-2 text-xs outline-none"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f} value={f}>{f.split(',')[0].replace(/'/g, '')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[0.6rem] text-muted-foreground">
                  Fuente display
                </label>
                <select
                  value={editTokens['--font-display'] ?? 'system-ui, sans-serif'}
                  onChange={(e) => updateToken('--font-display', e.target.value)}
                  className="h-8 w-full rounded border bg-transparent px-2 text-xs outline-none"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f} value={f}>{f.split(',')[0].replace(/'/g, '')}</option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !draft}
              className="inline-flex h-8 items-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? (
                <><Loader2 className="mr-1.5 size-3 animate-spin" /> Guardando...</>
              ) : (
                'Guardar tokens'
              )}
            </button>
            {draft && (
              <button
                onClick={handleReset}
                className="inline-flex h-8 items-center gap-1 rounded-md border px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3" /> Descartar
              </button>
            )}
            {saved && (
              <span className="flex items-center gap-1 text-xs text-emerald-600">
                <Check className="size-3" /> Guardado
              </span>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// --- Image Manager ---

const IMAGE_CATEGORIES = ['hero', 'team', 'clinic', 'services', 'general'] as const

function ImageManager({ tenantId }: { tenantId: any }) {
  const images = useQuery(api.images.getByTenant, { tenantId })
  const generateUploadUrl = useMutation(api.images.generateUploadUrl)
  const saveImage = useMutation(api.images.saveImage)
  const deleteImage = useMutation(api.images.deleteImage)
  const [expanded, setExpanded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState<string>('general')

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const uploadUrl = await generateUploadUrl()
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      const { storageId } = await result.json()
      await saveImage({ tenantId, storageId, category })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader
        className="flex-row items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <CardTitle className="flex items-center gap-2 text-sm">
          <ImagePlus className="size-3.5" /> Imágenes
          {images && images.length > 0 && (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[0.6rem]">
              {images.length}
            </span>
          )}
        </CardTitle>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-3">
          {/* Upload */}
          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-8 rounded border bg-transparent px-2 text-xs outline-none"
            >
              {IMAGE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90">
              {uploading ? (
                <><Loader2 className="size-3 animate-spin" /> Subiendo...</>
              ) : (
                <><Upload className="size-3" /> Subir imagen</>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Gallery */}
          {images && images.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img: any) => (
                <div key={img._id} className="group relative">
                  <img
                    src={img.url}
                    alt=""
                    className="aspect-square w-full rounded-md border object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => navigator.clipboard.writeText(img.url)}
                      className="mr-1 rounded bg-white/20 p-1.5 text-white hover:bg-white/30"
                      title="Copiar URL"
                    >
                      <Check className="size-3" />
                    </button>
                    <button
                      onClick={() => deleteImage({ imageId: img._id })}
                      className="rounded bg-white/20 p-1.5 text-white hover:bg-red-500/80"
                      title="Eliminar"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                  <div className="mt-0.5 truncate text-[0.55rem] text-muted-foreground">
                    {img.category}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-muted-foreground py-4">
              No hay imágenes subidas aún.
            </p>
          )}
        </CardContent>
      )}
    </Card>
  )
}

function getDefaultContent(type: string): any {
  const defaults: Record<string, any> = {
    header: {
      clinicName: 'Mi Clínica',
      navItems: [],
      overlay: false,
    },
    hero: {
      heading: { es: 'Bienvenido a nuestra clínica' },
      subheading: { es: 'Tu salud es nuestra prioridad' },
      ctas: [{ label: { es: 'Agendar cita' }, href: '#contacto', variant: 'primary' }],
    },
    services: {
      eyebrow: { es: 'Nuestros servicios' },
      heading: { es: 'Servicios' },
      subheading: { es: 'Ofrecemos los mejores tratamientos' },
      items: [{ name: { es: 'Servicio 1' }, description: { es: 'Descripción del servicio' } }],
    },
    team: {
      eyebrow: { es: 'Nuestro equipo' },
      heading: { es: 'Conoce a nuestro equipo' },
      subheading: { es: 'Profesionales dedicados a tu bienestar' },
      members: [{ name: 'Dr. Nombre', role: { es: 'Especialista' }, bio: { es: '' }, photoUrl: '' }],
    },
    testimonials: {
      eyebrow: { es: 'Testimonios' },
      heading: { es: 'Lo que dicen nuestros pacientes' },
      items: [{ name: 'Paciente', location: 'Ciudad', service: 'Servicio', text: { es: 'Excelente atención.' }, rating: 5 }],
    },
    stats: {
      items: [
        { value: '1,000+', label: { es: 'Pacientes atendidos' } },
        { value: '10+', label: { es: 'Años de experiencia' } },
      ],
    },
    'cta-contact': {
      heading: { es: 'Agenda tu cita hoy' },
      subheading: { es: 'Estamos listos para atenderte' },
      cta: { label: { es: 'Contactar' }, href: '#', variant: 'primary' },
      details: [],
    },
    footer: {
      clinicName: 'Mi Clínica',
    },
  }
  return defaults[type] ?? {}
}

// --- Icon button ---

function IconButton({
  children,
  onClick,
  disabled,
  title,
  active,
  destructive,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  title?: string
  active?: boolean
  destructive?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:opacity-30 ${
        active
          ? 'bg-primary text-primary-foreground'
          : destructive
            ? 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}
