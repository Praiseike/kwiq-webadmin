import { ReactElement, useEffect, useState } from 'react'

import Image from 'next/image'

import tw from 'twin.macro'
import style from '../styles/Styles'

import Layout from '../layouts/layout'
import AppTab from '../layouts/home'
import Back from '../layouts/back'

import { Progress as ProgressX } from '@mantine/core'

import { useMe, useUserBonus } from '../hooks/api'

import { useAtom } from 'jotai'
import { activeHomeTabAtom } from '../stores'

import NumberFormat, { NumericFormat } from 'react-number-format'
import LoadingScreen from '../components/LoadingScreen'

export interface ProgressProps {}

export default function Progress({}: ProgressProps) {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('Wallet')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data, isLoading } = useUserBonus()
  const [remainder, setProgress] = useState(0)

  useEffect(() => {
    setProgress((data?.remainder / 500000) * 100)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  if (isLoading) return <LoadingScreen />
  return (
    <>
      <div tw="w-full flex flex-col justify-center mt-10">
        <Image
          tw="mx-auto"
          src="/img/progressicon.svg"
          width={172}
          height={145}
          alt="progress icon"
        />

        <p css={style.text.md} tw="w-full mt-10">
          Almost there
        </p>
        <p css={style.text.smfull} tw="w-4/5 mx-auto">
          You need additional{' '}
          {
            <NumericFormat
              thousandsGroupStyle="thousand"
              value={parseInt(data?.remainder)}
              prefix="$"
              decimalSeparator="."
              displayType="text"
              type="text"
              thousandSeparator={true}
              allowNegative={true}
            />
          }
          {' '}
          worth of transaction to get your ₦1000 bonus
        </p>
        <ProgressX value={((1000 - data?.remainder) / 1000) * 100} mt="xl" />
      </div>
    </>
  )
}

Progress.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <div tw=" bg-gradient-to-b from-[#67e8f93b] via-[#67e8f90f] bg-opacity-10 justify-items-end h-screen">
        <Back />
        <div tw="px-4 py-5">{page}</div>
        <AppTab />
      </div>
    </Layout>
  )
}
