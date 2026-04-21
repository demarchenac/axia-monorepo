import { createRouter } from '@tanstack/react-router'
import { getQueryClient } from './integrations/convex/provider'
import AppProviders from './integrations/providers'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const queryClient = getQueryClient()

  return createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    scrollRestoration: true,
    Wrap: AppProviders,
  })
}
