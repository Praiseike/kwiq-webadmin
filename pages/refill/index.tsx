import { ReactElement, useEffect, useState } from 'react'

import tw from 'twin.macro'

import Layout from '../../layouts/layout'
import AppTab from '../../layouts/home'
import Back from '../../layouts/back'

import Link from 'next/link'
import Image from 'next/image'

import { TextInput } from '@mantine/core'

import { MdArrowForwardIos, MdSearch } from 'react-icons/md'

import style from '../../styles/Styles'

import { useAtom } from 'jotai'
import { activeHomeTabAtom } from '../../stores'

export interface IAllCardsProps {}

const Refill = ({}: IAllCardsProps) => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('Transactions')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const allBills = [
    { bill: 'Pay Tv Bills', icon: '/img/tvbillicon.svg', link: 'bills/tv' },
    {
      bill: 'Pay Electricity Bills',
      icon: '/img/electricitybillicon.svg',
      link: '/bills/electricity',
    },
    {
      bill: 'Buy Airtime',
      icon: '/img/buyairtimeicon.svg',
      link: '/bills/airtime',
    },
    { bill: 'Buy Data', icon: '/img/buydataicon.svg', link: '/bills/data' },
  ]

  const [bills, setBills] = useState(allBills)
  const [search, setSearch] = useState('')

  const handleSearch = (e: any) => {
    const searched = allBills.filter(
      bill =>
        bill.bill.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1,
    )
    setSearch(e.target.value)
    setBills(searched)
    //console.log(searched)
  }
  return (
    <>
      <p tw="w-full text-2xl font-medium ">Refill</p>
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
            <Link passHref href={bill.link}>
              <div tw="w-full flex justify-between items-center cursor-pointer">
                {/* leftSection */}
                <div tw="inline-flex items-center space-x-2">
                  <Image src={bill.icon} height={24} width={24} alt="" />
                  <p tw="[font-size:14px] text-black1 font-medium">
                    {bill.bill}
                  </p>
                </div>
                <MdArrowForwardIos color="gray" />
              </div>
            </Link>
          </div>
        ))}
    </>
  )
}
Refill.auth = true
Refill.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back />
      <AppTab />
      <div tw="px-4 py-5 w-full">{page}</div>
    </Layout>
  )
}

export default Refill
