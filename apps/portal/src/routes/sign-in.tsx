import { createFileRoute, redirect } from '@tanstack/react-router'
import { getAuth, getSignInUrl } from '@workos/authkit-tanstack-react-start'

export const Route = createFileRoute('/sign-in')({
  beforeLoad: async () => {
    const { user } = await getAuth()
    if (user) {
      throw redirect({ to: '/' })
    }
    const signInUrl = await getSignInUrl({ data: { returnPathname: '/' } })
    throw redirect({ href: signInUrl })
  },
})
