import { createFileRoute } from '@tanstack/react-router'
import { signOut } from '@workos/authkit-tanstack-react-start'

export const Route = createFileRoute('/api/auth/signout')({
  server: {
    handlers: {
      GET: async () => {
        return signOut({ data: { returnTo: '/sign-in' } })
      },
    },
  },
})
