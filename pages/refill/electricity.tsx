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

import ElectricityPayment from '../../components/bills/ElectricityPayment'

export interface IElectricityProps {}

const Electricity = (props: IElectricityProps) => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('Transactions')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const allElectricityBills = [
    { bill: 'IKEDC', icon: '/img/bills/ikedc.png' },
    { bill: 'IBEDC', icon: '/img/bills/ibedc.png' },
    { bill: 'EKEDC', icon: '/img/bills/ekedc.png' },
    { bill: 'EEDC', icon: '/img/bills/eedc.png' },
    { bill: 'PHEDC', icon: '/img/bills/phedc.png' },
    { bill: 'BEDC', icon: '/img/bills/bedc.png' },
    { bill: 'YEDC', icon: '/img/bills/yedc.png' },
    { bill: 'KEDC', icon: '/img/bills/kedc.png' },
  ]

  const [bills, setBills] = useState(allElectricityBills)
  const [search, setSearch] = useState('')
  const [bill, setBill] = useState('')

  const [showBillPaymeny, setShowBillPaymeny] = useState(false)

  const handleSearch = (e: any) => {
    const searched = allElectricityBills.filter(
      bill =>
        bill.bill.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1,
    )
    setSearch(e.target.value)
    setBills(searched)
  }
  return (
    <>
      <Drawer
        opened={showBillPaymeny}
        position="bottom"
        padding="xs"
        onClose={() => setShowBillPaymeny(false)}
        size="full"
        tw=""
      >
        <ElectricityPayment provider={bill} />
      </Drawer>

      <p tw="w-full text-2xl font-medium ">Pay Electricity Bills</p>
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

      {bills &&
        bills.map((bill: any, index: number) => (
          <div
            key={index}
            tw="block w-full border-b-[1px] border-b-[hsl(230 33% 86%)] py-3"
          >
            <div
              onClick={() => {
                setBill(bill.bill)
                setShowBillPaymeny(true)
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
Electricity.auth = true
Electricity.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back />
      <AppTab />
      <div tw="px-4 py-5 w-full">{page}</div>
    </Layout>
  )
}

export default Electricity
