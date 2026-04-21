/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import appCss from '~/styles/app.css?url'

let convexClient: ConvexReactClient | null = null
function getConvexClient() {
  if (!convexClient && typeof window !== 'undefined') {
    convexClient = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)
  }
  return convexClient
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Axia Odontología — Demo de dirección visual' },
      {
        name: 'description',
        content:
          'Demo navegable con 12 variantes visuales para Axia Odontología. 4 estilos × 3 paletas para iterar dirección visual con el cliente.',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootComponent() {
  const client = getConvexClient()
  if (!client) {
    return <Outlet />
  }
  return (
    <ConvexProvider client={client}>
      <Outlet />
    </ConvexProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
