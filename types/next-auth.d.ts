import NextAuth from 'next-auth'
import { DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    id: string
    user: {
      _id: string
      firstName: string
      lastName: string
    } & DefaultSession['user']
  }

  interface User {
    xidkey?: string
    _id: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    xidkey?: string
    id: string
  }
}
