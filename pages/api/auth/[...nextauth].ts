import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { axios } from '../../../libs/axios'
import { vendored } from 'next/dist/server/future/route-modules/app-page/module.compiled'



// {
//   "isMobile": true,
//   "deviceType": "mobile",
//   "vendor": "Apple",
//   "model": "iPhone",
//   "os": "iOS",
//   "osVersion": "16.6",
//   "ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
// }

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials: any,req): Promise<any | null> {
        let user: any = {}
        const deviceInfo = JSON.parse(credentials.deviceInfo)
        // const ipAddress = req?.headers?.['x-real-ip'] || req?.connection?.remoteAddress;
        const ipAddress = credentials.ipAddress;

        let query = "";

        if(deviceInfo.isMobile){
          const model = deviceInfo.model;
          const device = deviceInfo.os;
          const brand = deviceInfo.vendor;
          
          query = `?ip=${ipAddress}&brand=${brand}&model=${model}&type=${device}`;
        }

        query = `?ip=${ipAddress}&brand=${deviceInfo.browserName ?? 'web'}&model=${deviceInfo.osVersion}&type=${deviceInfo.osName}`;

        try {


          const response = await axios.post('/user/login'+query, {
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
