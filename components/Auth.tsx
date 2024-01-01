import { ReactElement, useEffect } from 'react'
import NextNProgress from 'nextjs-progressbar'
import { useRouter } from 'next/router'
import tw from 'twin.macro'

import { useSession, useMe } from '../hooks/api'
import Image from 'next/image'

interface AuthProps {
  children: ReactElement
}
export default function Auth({ children }: AuthProps) {
  const { session, isLoading } = useSession()

  const router = useRouter()
  const hasUser = !!session?.user

  useEffect(() => {
    if (!isLoading && !hasUser) {
      router.push('/auth/signin')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUser, isLoading])
  if (isLoading || !hasUser) {
    return (
      <>
        <NextNProgress options={{ showSpinner: false }} />
        <div tw="flex items-center justify-center  h-screen fixed inset-0 bg-white">
          <Image
            tw="-mt-20"
            src="/img/kwiq-logo.jpg"
            height="300"
            width="300"
            alt="kwiq logo"
          />
        </div>
      </>
    )
  }
  return children
}
