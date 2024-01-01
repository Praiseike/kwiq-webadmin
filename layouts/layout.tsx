import tw from 'twin.macro'
import { cache } from '@emotion/css'
import { CacheProvider } from '@emotion/react'
import GlobalStyles from '../styles/GlobalStyles'
import { MantineProvider } from '@mantine/core'
//import tw from 'twin.macro'

import localFont from '@next/font/local'

const euclid = localFont({
  src: [
    {
      path: '../fonts/Euclid-Circular-A-Regular.ttf',
      weight: '400',
      style: 'normal',
    },

    {
      path: '../fonts/Euclid-Circular-A-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
})

const Layout = ({ children }: any) => {
  return (
    <>
      <CacheProvider value={cache}>
        <GlobalStyles />

        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: 'light',
            fontFamily: euclid.style.fontFamily,
          }}
        >
          <div tw="flex flex-col max-w-lg mx-auto w-full relative items-center pb-12">
            {children}
          </div>
        </MantineProvider>
      </CacheProvider>
    </>
  )
}

export default Layout
