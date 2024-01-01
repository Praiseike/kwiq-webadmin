import React, { ReactElement, useEffect, useState } from 'react'

import tw from 'twin.macro'

import Layout from '../../layouts/layout'
import AppTab from '../../layouts/home'
import Back from '../../layouts/back'

import Image from 'next/image'

import { TextInput, Drawer } from '@mantine/core'

import { MdArrowForwardIos, MdSearch } from 'react-icons/md'

import style from '../../styles/Styles'

import { useAtom } from 'jotai'
import { activeHomeTabAtom } from '../../stores'

import TvPayment from '../../components/bills/TvPayment'

export interface ITvProps {}

const Tv = ({}: ITvProps) => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('Transaction')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const allTvBills = [
    { bill: 'Pay DSTV Bills', icon: '/img/bills/dstv.png', provider: 'DsTV' },
    { bill: 'Pay GOTV Bills', icon: '/img/bills/gotv.png', provider: 'GoTV' },
    {
      bill: 'Pay STARTIMES Bills',
      icon: '/img/bills/startimes.png',
      provider: 'Startime',
    },
  ]

  const [providers, setProviders] = useState(allTvBills)
  const [provider, setProvider] = useState('')
  const [search, setSearch] = useState('')
  const [showBillPayment, setShowBillPayment] = useState(false)

  const handleSearch = (e: any) => {
    const searched = allTvBills.filter(
      bill =>
        bill.bill.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1,
    )
    setSearch(e.target.value)
    setProviders(searched)
  }
  return (
    <>
      <Drawer
        opened={showBillPayment}
        position="bottom"
        padding="xs"
        onClose={() => setShowBillPayment(false)}
        size="full"
        tw=""
        zIndex={20}
      >
        <TvPayment provider={provider} />
      </Drawer>

      <p tw="w-full text-2xl font-medium ">Pay Tv Bills</p>
      <form action="" tw="w-full inline-flex space-x-3 my-4">
        <TextInput
          tw="w-full rounded-full"
          required
          placeholder="Search biller"
          icon={<MdSearch size="24" />}
          size="md"
          value={search}
          onChange={handleSearch}
          styles={{
            input: style.input.search,
            error: style.input.error,
          }}
        />
      </form>

      {providers &&
        providers.map((bill: any, index: number) => (
          <div
            key={index}
            tw="block w-full border-b-[1px] border-b-[hsl(230 33% 86%)] py-3"
          >
            <div
              onClick={() => {
                setProvider(bill.provider)
                setShowBillPayment(true)
              }}
              tw="w-full flex justify-between items-center cursor-pointer"
            >
              {/* leftSection */}
              <div tw="inline-flex items-center space-x-2">
                <Image src={bill.icon} height={40} width={45} alt="" />
                <p tw="[font-size:14px] text-deepblue font-medium">
                  {bill.bill}
                </p>
              </div>
              {/* rightSection */}
              <MdArrowForwardIos color="gray" />
            </div>
          </div>
        ))}
    </>
  )
}
Tv.auth = true
Tv.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back />
      <AppTab />
      <div tw="px-4 py-5 w-full">{page}</div>
    </Layout>
  )
}

export default Tv
