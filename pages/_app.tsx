import { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import { NotificationsProvider } from '@mantine/notifications'

import { SessionProvider } from 'next-auth/react'

import Auth from '../components/Auth'

import '../styles/style.css'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
  auth?: boolean
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? (page => page)
  return getLayout(
    <SessionProvider session={session}>
      <NotificationsProvider position="top-center">
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </NotificationsProvider>
    </SessionProvider>,
  )
}
//export default MyApp
