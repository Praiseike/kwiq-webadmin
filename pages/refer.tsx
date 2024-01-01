import { ReactElement, useEffect } from 'react'

import tw from 'twin.macro'

import Layout from '../layouts/layout'
import AppTab from '../layouts/home'

import { useMe } from '../hooks/api'

import { useAtom } from 'jotai'
import { activeHomeTabAtom } from '../stores'

import ReferCode from '../components/ReferCode'
import LoadingScreen from '../components/LoadingScreen'

export interface ReferCodeProps {}

export default function Refer({}: ReferCodeProps) {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('Settings')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { me, isLoading } = useMe()

  if (isLoading) return <LoadingScreen />

  return <>{me && <ReferCode me={me} />}</>
}

Refer.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <div tw=" bg-[#ebfffd] justify-items-end h-screen">
        {/*  <Back /> */}
        <div tw="w-full px-4 py-2">{page}</div>
        <AppTab />
      </div>
    </Layout>
  )
}
