import Head from 'next/head'
import Image from 'next/image'

const DefaultLayout = ({ children }: any) => {
  return (
    <>
      <Head>
        <title>KWIQ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div tw="antialiased container mx-auto max-w-7xl mt-0">
        <main tw="p-4 md:p-16">{children}</main>
      </div>
    </>
  )
}

export default DefaultLayout
