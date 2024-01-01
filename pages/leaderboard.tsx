import React, { ReactElement, useEffect, useState } from 'react'
import Image from 'next/image'
import tw from 'twin.macro'

import Layout from '../layouts/layout'
import AppTab from '../layouts/home'
import Back from '../layouts/back'

import { Avatar, Tabs, Drawer, Group, Loader, TabsValue } from '@mantine/core'

import axios from 'axios'

import { activeHomeTabAtom } from '../stores'
import { useAtom } from 'jotai'
import useSWR from 'swr'
import { FaUserSlash } from 'react-icons/fa'
import { NumericFormat } from 'react-number-format'

const Leaderboard = () => {
  const [, setActiveTabAtom] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTabAtom('More')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /*   useEffect(() => {
    axios.get('api/get-token').then(res => console.log(res.data))
  }, [])
 */
  const [type, setType] = useState<string | TabsValue>('gift_card')
  const [others, setOthers] = useState<any>([])
  const [topers, setTopers] = useState<any>([])

  const [activeTab, setActiveTab] = useState<string | null>('gift_card')

  const { data, error } = useSWR(`fetch-leaderboard/${type}`, async () => {

    const res = await axios.get(`/api/fetch-leaderboard/?type=${type}`)
    return res.data.data.data
  })

  // console.log(data)
  useEffect(() => {
    // console.log('leaders', data)
    // if the length is greater than 3 slice else just set the others
    if(activeTab !== 'gift_card'){
      // sorting from highest to lowest
      data?.sort(function (a: any, b: any) {
        return b.coin_trade_amount - a.coin_trade_amount;
      })
    }

    if (data?.length > 0) {
      if (data?.length > 3) {
        setTopers(data.slice(0, 3)) // first 3
        setOthers(data.slice(3)) //others 4>
      } else {
        setTopers(data) // reset others
        setOthers([]);
      }
    }
  }, [data])


  const getAmountCondition = (data: any): number => {
    const amount: number = 'gift_card' === activeTab ?
      Math.trunc(data?.card_trade_amount / 1000)
      :
      Math.trunc(data?.coin_trade_amount / 1000);
    return amount
  }

  const handleSetTopers = (
    <>
      <div tw="mt-3 flex justify-center -space-x-4">
        <div tw="flex-col space-y-2 flex items-center">
          <Avatar size="md" radius="xl" color="violet">
            2
          </Avatar>
          <div tw="flex h-24 w-24 rounded-full ring-2 ring-white bg-primary z-10 text-center items-center justify-items-center justify-center">
            {topers[1] ? (
              <p tw="text-white">{topers[1].firstName}</p>
            ) : (
              <FaUserSlash color="gray" />
            )}
          </div>
          <div tw="flex flex-col items-center">
            <p tw="text-black1 font-semibold flex items-center">
              {topers[1]?.card_trade_count}
              {topers[1]?.coin_trade_count}
              <Image
                src="/img/medal.svg"
                height="24"
                width="20"
                alt="medal image"
              />
            </p>
            <NumericFormat
              tw="text-sm font-semibold"
              thousandsGroupStyle="thousand"
              value={getAmountCondition(topers[1])}
              prefix=""
              suffix=""
              decimalSeparator="."
              displayType="text"
              type="text"
              thousandSeparator={true}
              allowNegative={true}
            />
          </div>
        </div>
        <div tw="flex-col space-y-2 flex items-center">
          <Image src="/img/first.svg" width="44" height="44" alt="" />
          <div tw="flex h-[130px] w-[130px] rounded-full ring-4 ring-white [background:linear-gradient(45.75deg, #FF632B 0%, #FFD2AA 143.87%)] z-20 text-center items-center justify-items-center justify-center">
            {topers[0] ? (
              <p tw="text-white">{topers[0]?.firstName}</p>
            ) : (
              <FaUserSlash color="gray" />
            )}
          </div>
          <div tw="flex flex-col items-center">
            <p tw="text-black1 text-sm font-semibold flex items-center">
              {topers[0]?.card_trade_count}
              {topers[0]?.coin_trade_count}
              <Image
                src="/img/medal.svg"
                height="24"
                width="20"
                alt="medal iamge"
              />
            </p>
            <NumericFormat
              tw="text-sm font-semibold"
              thousandsGroupStyle="thousand"
              value={getAmountCondition(topers[0])}
              prefix=""
              suffix=""
              decimalSeparator="."
              displayType="text"
              type="text"
              thousandSeparator={true}
              allowNegative={true}
            />
          </div>
        </div>
        <div tw="flex-col space-y-2 flex items-center">
          <Avatar size="md" radius="xl" color="cyan">
            3
          </Avatar>
          <div tw="flex h-24 w-24 rounded-full ring-2 ring-white bg-[#46E1FC] z-10 text-center items-center justify-items-center justify-center">
            {topers[2] ? (
              <p tw="text-white">{topers[2]?.firstName}</p>
            ) : (
              <FaUserSlash color="gray" />
            )}
          </div>
          <div tw="flex flex-col items-center">
            <p tw="text-black1 text-sm font-semibold flex items-center">
              {topers[2]?.card_trade_count}
              {topers[2]?.coin_trade_count}
              <Image
                src="/img/medal.svg"
                height="24"
                width="20"
                alt="medal iamge"
              />
            </p>
            <NumericFormat
              tw="text-sm font-semibold"
              thousandsGroupStyle="thousand"
              value={getAmountCondition(topers[2])}
              prefix=""
              suffix=""
              decimalSeparator="."
              displayType="text"
              type="text"
              thousandSeparator={true}
              allowNegative={true}
            />
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <div tw="flex flex-col w-full justify-center">
        <div tw="w-full flex items-center justify-between mt-2"></div>

        <Tabs
          tw="w-full my-3"
          variant="pills"
          color="#fff"
          styles={() => ({
            tabActive: tw`!bg-white rounded-full text-2xl`,
            tabsListWrapper: tw`bg-[#E7E9F3] rounded-full text-gray2 p-1`,
            tabLabel: tw`text-sm text-black font-medium rounded-full`,
            tabsList: tw`bg-[#E7E9F3] rounded-full text-gray2 p-1`,
            tab: {
              borderRadius: '99999px',
              '&[data-active="true"]': tw`!bg-white rounded-full text-2xl`,
            },
          })}
          defaultValue={activeTab}
          value={activeTab}
          onTabChange={value => {
            setActiveTab(value)
            setType(value)
          }}
        >
          <Tabs.List grow>
            <Tabs.Tab value="gift_card">Giftcards</Tabs.Tab>
            <Tabs.Tab value="coin">Crypto</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="gift_card">
            {!data && !error ? (
              <Group position="center" mt="xl">
                <Loader />
              </Group>
            ) : topers.length > 0 ? (
              handleSetTopers
            ) : (
              <p tw="text-center mt-5">No leaders</p>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="coin">
            {!data && !error ? (
              <Group position="center" mt="xl">
                <Loader />
              </Group>
            ) : topers.length > 0 ? (
              handleSetTopers
            ) : (
              <p tw="text-center mt-5">No leaders</p>
            )}
          </Tabs.Panel>
        </Tabs>

        {others &&
          others.map((other: any, index: number) => (
            <div
              key={index}
              tw="w-full flex flex-row space-x-4 justify-between items-center border-b-[1px] border-b-[hsl(230 33% 86%)] py-4"
            >
              <p tw="font-medium">{index + 4}</p>
              <Avatar tw="uppercase" size="md" radius="xl" color="blue">
                {other?.firstName.charAt(0)}
              </Avatar>
              <div tw="flex flex-col flex-1">
                <div tw="inline-flex space-x-1 items-baseline">
                  <p tw="font-medium text-sm text-black">
                    {other?.card_trade_count} -
                  </p>
                  <NumericFormat
                    tw="font-medium text-sm"
                    thousandsGroupStyle="thousand"
                    value={Math.trunc(other?.card_trade_amount / 1000)}
                    prefix=""
                    suffix=""
                    decimalSeparator="."
                    displayType="text"
                    type="text"
                    thousandSeparator={true}
                    allowNegative={true}
                  />
                </div>

                <div tw="inline-flex items-center space-x-1">
                  <p tw="text-xs text-primary">{other?.firstName}</p>
                  <p tw="text-xs">- @{other?.firstName}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  )
}

Leaderboard.auth = true
Leaderboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <AppTab />
      <Back
        title={<p tw="text-black1 [font-size:18px] font-medium">Leaderboard</p>}
      />
      <div tw="w-full px-4 py-5">{page}</div>
    </Layout>
  )
}

export default Leaderboard
