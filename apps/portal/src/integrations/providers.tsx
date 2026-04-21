import AppConvexProvider from './convex/provider'
import AppWorkOSProvider from './workos/provider'

export default function AppProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppWorkOSProvider>
      <AppConvexProvider>{children}</AppConvexProvider>
    </AppWorkOSProvider>
  )
}
