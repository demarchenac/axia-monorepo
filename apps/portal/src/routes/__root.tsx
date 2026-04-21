/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import * as React from 'react'
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
      { title: 'Talvu — Portal Admin' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
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
      <body className="bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
