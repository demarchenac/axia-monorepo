import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-neutral-100">
      <div className="text-center">
        <h1 className="mb-2 text-5xl font-bold tracking-tight md:text-7xl">
          Talvu
        </h1>
        <p className="mb-8 text-lg text-neutral-400">
          Digitalización inteligente para tu negocio.
          <br />
          Marketing, atención al cliente y gestión interna.
        </p>
        <div className="inline-flex items-center gap-2 rounded-full bg-neutral-800/50 px-4 py-2 font-mono text-xs text-neutral-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
          Próximamente
        </div>
      </div>
    </div>
  )
}
