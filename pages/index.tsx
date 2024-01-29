import tw from 'twin.macro'
import React, { ReactElement, useEffect, useState } from 'react'

import Layout from '../layouts/layout'
import AppTab from '../layouts/home'
import ReferCode from '../components/ReferCode'
import ChatBtn from '../components/ChatBtn'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'

import { Avatar, Text, Badge, Drawer } from '@mantine/core'

import { MdArrowForwardIos, MdNotifications } from 'react-icons/md'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

import { useDashboard } from '../hooks/api'
import Style from '../styles/Styles'

import { activeHomeTabAtom } from '../stores'
import { useAtom } from 'jotai'
import { useMe } from '../hooks/api'
import { NumericFormat } from 'react-number-format'

import 'animate.css'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'

const allBills = [
  /*   { bill: 'Pay Tv Bills', icon: '/img/tvbillicon.svg', link: 'bills/tv' },
  {
    bill: 'Pay Electricity Bills',
    icon: '/img/electricitybillicon.svg',
    link: '/bills/electricity',
  }, */
  {
    bill: 'Buy Airtime',
    icon: '/img/buyairtimeicon.svg',
    link: '/bills/airtime',
  },
  { bill: 'Buy Data', icon: '/img/buydataicon.svg', link: '/bills/data' },
]

const Index = ({pageStates}: {pageStates: any}) => {
  const router = useRouter()
  const [, setActiveTab] = useAtom(activeHomeTabAtom)

  useEffect(() => {
    setActiveTab('Home')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { dashboard, isLoading: dashboardIsloading } = useDashboard()
  const { me, isLoading: isMeLoading } = useMe()

  const [balanceHide, setBalanceHide] = useState(true)

  const [showRefer, setShowRefer] = useState(false)
  const [showRefill, setShowRefill] = useState(false)
  const [showNetworks, setShowNetworks] = useState(false)
  const [refillType, setRefillType] = useState<'data' | 'airtime' | null>(null)
  const link = `/refill/${refillType}`

  const [unreadNotififcations, setUnreadNotifications] = useState([])

  useEffect(() => {
    const unread = dashboard?.notifications?.filter(
      (item: any) => item?.read == false,
    )
    setUnreadNotifications(unread)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardIsloading])

  const handelRefillSelection = (type: string) => {
    if (type == 'airtime') {
      setShowRefill(false)
      setShowNetworks(true)
      setRefillType('airtime')
    } else if (type == 'data') {
      setShowRefill(false)
      setShowNetworks(true)
      setRefillType('data')
    }
  }

  return (
    <>
      <ChatBtn />
      {!isMeLoading && (
        <Drawer
          opened={showRefer}
          position="bottom"
          transition="pop"
          padding="xs"
          onClose={() => setShowRefer(false)}
          size="full"
          withCloseButton={false}
          tw="bg-[#ebfffd] justify-items-end"
        >
          <ReferCode me={me} handleClose={setShowRefer} />
        </Drawer>
      )}

      {/* Bills */}
      <Drawer
        opened={showRefill}
        position="bottom"
        padding="xs"
        withCloseButton={false}
        size={130}
        onClose={() => setShowRefill(false)}
        tw="rounded-tr-xl rounded-tl-xl"
      >
        <div tw="block w-full border-b-[1px]  border-b-[hsl(230 33% 86%)] py-3">
          <div
            onClick={() => handelRefillSelection('airtime')}
            tw="w-full flex justify-between items-center cursor-pointer"
          >
            <div tw="inline-flex items-center space-x-2">
              <Image
                src="/img/buyairtimeicon.svg"
                height={24}
                width={24}
                alt="airtime icon"
              />
              <p tw="[font-size:14px] text-black1 font-medium">Buy Airtime</p>
            </div>
            <MdArrowForwardIos color="gray" />
          </div>
        </div>

        <div tw="block w-full  border-b-0 border-b-[hsl(230 33% 86%)] py-3">
          <div
            onClick={() => handelRefillSelection('data')}
            tw="w-full flex justify-between items-center cursor-pointer"
          >
            <div tw="inline-flex items-center space-x-2">
              <Image
                src="/img/buydataicon.svg"
                height={24}
                width={24}
                alt="airtime icon"
              />
              <p tw="[font-size:14px] text-black1 font-medium">Buy Data</p>
            </div>
            <MdArrowForwardIos color="gray" />
          </div>
        </div>
      </Drawer>

      {/* Networks */}

      <Drawer
        opened={showNetworks}
        position="bottom"
        padding="xs"
        withCloseButton={false}
        size={125}
        onClose={() => setShowNetworks(false)}
        tw="rounded-tr-xl rounded-tl-xl"
      >
        <div tw="w-full">
          <p tw="text-center text-lg mt-2">Select Your Network</p>
          <div tw="w-full flex justify-evenly space-x-2">
            <Image
              onClick={() => {
                router.push(link + '/?network=airtel')
              }}
              tw="cursor-pointer"
              src="/img/bills/airtel.png"
              height={64}
              width={64}
              alt="airtime icon"
            />
            <Image
              onClick={() => {
                router.push(link + '/?network=mtn')
              }}
              tw="cursor-pointer"
              src="/img/bills/mtn.png"
              height={64}
              width={64}
              alt="airtime icon"
            />
            <Image
              onClick={() => {
                router.push(link + '/?network=9mobile')
              }}
              tw="cursor-pointer"
              src="/img/bills/9mobile.png"
              height={64}
              width={64}
              alt="airtime icon"
            />
            <Image
              onClick={() => {
                router.push(link + '/?network=glo')
              }}
              tw="cursor-pointer"
              src="/img/bills/glo.png"
              height={64}
              width={64}
              alt="airtime icon"
            />
          </div>
        </div>
      </Drawer>

      <div tw="flex flex-col w-full justify-center">
        <div tw="flex justify-between">
          <div tw="inline-flex items-center space-x-1">
            <Link passHref href="/profile">
              <Avatar
                tw="cursor-pointer"
                src={''}
                radius="xl"
                size="sm"
                alt={`${dashboard?.lastName} ${dashboard?.firstName}`}
                color="green"
              >
                {dashboard?.lastName.charAt(0)}
                {dashboard?.firstName.charAt(0)}
              </Avatar>
            </Link>

            <Text css={[Style.text.sm]} tw="text-primary">
              Hello, {dashboard?.firstName}
            </Text>
            <Image src="/img/wave.svg" height={16} width={16} alt="wave" />
          </div>
          <div tw="relative">
            <Link passHref href="/notifications">
              <MdNotifications tw="text-primary" size="22px" />
            </Link>
            {unreadNotififcations?.length > 0 && (
              <Badge
                radius="xl"
                size="xs"
                tw="[letter-spacing:0px] absolute bg-red-500 text-white -top-2 -right-1 cursor-pointer"
              >
                {unreadNotififcations?.length < 9 &&
                  unreadNotififcations?.length}
                {unreadNotififcations?.length > 9 && '9+'}
              </Badge>
            )}
          </div>
        </div>

        <div tw="relative block items-center mt-3 bg-primary px-4 py-7 rounded-md">
          <Text tw="text-white text-center text-sm">Account balance</Text>

          {balanceHide && (
            <Text tw="text-white text-center text-4xl mt-4">***</Text>
          )}
          {!balanceHide && (
            <div tw="flex justify-center">
              <NumericFormat
                css={[tw`text-white text-center text-4xl mt-4`]}
                thousandsGroupStyle="thousand"
                value={dashboard?.balance}
                prefix="₦"
                suffix=""
                decimalSeparator="."
                displayType="text"
                type="text"
                thousandSeparator={true}
                allowNegative={true}
              />
            </div>
          )}

          <div tw=" top-2 right-1 absolute">
            <Badge
              styles={{ leftSection: tw`mr-0` }}
              variant="filled"
              color="blue"
              leftSection={
                balanceHide ? (
                  <div tw="inline-flex items-center">
                    <AiOutlineEye tw="mr-1" />
                    Reveal
                  </div>
                ) : (
                  <div tw="inline-flex items-center">
                    <AiOutlineEyeInvisible tw="mr-1" />
                    Hide
                  </div>
                )
              }
              onClick={() => setBalanceHide(!balanceHide)}
              radius="xl"
              size="md"
              tw="normal-case text-white cursor-pointer"
            ></Badge>
          </div>
        </div>
        <div tw="flex flex-row justify-evenly bg-[#E7E9F3] rounded-full text-gray2 p-1 mt-5">
          <p
            tw="bg-white rounded-full w-full text-center p-2 font-semibold"
            onClick={() => {
              router.push('/cards')
            }}
          >
            Sell and Refill
          </p>
          <p
            tw="w-full text-center p-2 cursor-pointer font-semibold"
            onClick={() => {
              router.push('/wallet')
            }}
          >
            Withdraw
          </p>
        </div>
        <div tw="grid grid-cols-2 justify-evenly justify-items-stretch gap-4 mt-5">
          <Link passHref href={pageStates?.btc_page? "/sell-crypto": ""}>
            <div tw="block p-5 bg-[#EEF8FF] rounded-lg cursor-pointer">
              <Image
                src="/img/sellcryptoicon.svg"
                height={32}
                width={32}
                alt="crypto"
              />
              <Text tw="text-lg font-semibold">Sell Crypto</Text>
              <Text tw="text-sm text-[#626579] mt-2">
                  {
                    pageStates?.btc_page ? 
                      "Sell Bitcoins, USDT, ETH Instantly"
                    : "unavailable"
                  }
              </Text>
            </div>
          </Link>

          <Link passHref href={pageStates?.giftcard_page? "/cards": ""}>
            <div tw="block p-5 bg-[#E4FFF0] rounded-lg cursor-pointer h-full w-auto">
              <Image
                src="/img/giftcardicon.svg"
                height={32}
                width={32}
                alt="gift card"
              />
              <Text tw="text-lg font-semibold">Sell Giftcards</Text>
                <Text tw="text-sm text-[#626579] mt-2">
                  {
                    pageStates?.giftcard_page ? 
                      "Sell your Gift Card Instantly"
                    : "unavailable"
                  }
                </Text>
            </div>
          </Link>

          <div
            onClick={() => setShowRefill(true)}
            tw="block p-5 bg-[#fcf4db] rounded-lg cursor-pointer"
          >
            <Image
              src="/img/refillicon.svg"
              height={32}
              width={32}
              alt="refil"
            />
            <Text tw="text-lg font-semibold">Refill</Text>
            <Text tw="text-sm text-[#626579] mt-2">
              Pay Bills, Buy Airtime and Data
            </Text>
          </div>

          <div
            onClick={() => setShowRefer(true)}
            tw="block p-5 bg-[#EEF8FF] rounded-lg cursor-pointer"
          >
            <Image
              src="/img/refericon.svg"
              height={32}
              width={32}
              alt="refer"
            />
            <Text tw="text-lg font-semibold">Refer & Earn</Text>
            <Text tw="text-sm text-[#626579] mt-2">
              Refer someone today and earn over &#8358;5k
            </Text>
          </div>
        </div>

        <Link passHref href="/progress">
          <div tw="overflow-hidden pb-5">
            <div
              className="animate__animated animate__bounceInRight"
              tw=" pointer-events-none flex justify-between rounded-lg p-5 mt-5 bg-[#F8F8F8]"
            >
              <div tw="w-3/5">
                <p tw="text-lg font-semibold text-primary">
                  Click here to get &#8358;1,000 bonus
                </p>
                <p tw="text-xs font-normal text-gray2">
                  Automatically get &#8358;1,000 naira when you trade up to
                  $1,000
                </p>
              </div>
              <div tw="-mb-20">
                <Image
                  priority
                  src="/img/bicycleicon.svg"
                  height={120}
                  width={120}
                  alt="bicycle"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  )
}


export async function getServerSideProps(context: GetServerSidePropsContext){

  const session = await getServerSession(context.req,context.res,authOptions);
  
  const pageStates = session?.user?.pageStates;


  if(pageStates){
    return {
      props:{
        pageStates
      }
    }
  }
  
  return {
    props: {
      // pageStates
    },
  };
}

Index.auth = true

Index.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <AppTab >
        <div tw="px-4 py-5 relative">
          {page}
        </div>
      </AppTab>
    </Layout>
  )
}

export default Index
