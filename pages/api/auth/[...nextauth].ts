import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { axios } from '../../../libs/axios'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials: any): Promise<any | null> {
        let user: any = {}
        try {
          const response = await axios.post('/user/login', {
            userId: credentials.userId,
            password: credentials.password,
          })
          if (response.status == 200) {
            user = response.data.data
            user.xidkey = response.headers['x-id-key']
            return user
          }
        } catch (e) {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.xidkey = user.xidkey
        delete user.xidkey
        token.id = user._id
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        //console.log('in next-auth ' + token.xidkey)
        session.id = token.id
        session.user = token.user
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
}
export default NextAuth(authOptions)
