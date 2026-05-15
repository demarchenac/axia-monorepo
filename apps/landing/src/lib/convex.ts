import { ConvexReactClient } from 'convex/react'
import { ConvexHttpClient } from 'convex/browser'

export const convexClient = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL as string,
)

export const convexHttp = new ConvexHttpClient(
  import.meta.env.VITE_CONVEX_URL as string,
)
