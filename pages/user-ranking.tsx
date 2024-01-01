import React, { ReactElement, useEffect } from 'react'

import tw from 'twin.macro'

import Layout from '../layouts/layout'
import AppTab from '../layouts/home'
import Back from '../layouts/back'
import Image from 'next/image'

import Style from '../styles/Styles'

import { useAtom } from 'jotai'
import { activeHomeTabAtom } from '../stores'

export interface IUserRankingProps {}

const UserRanking = ({}: IUserRankingProps) => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('More')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <div tw="w-full ">
        <p tw="mt-5" css={Style.text.md}>
          User ranking
        </p>
      </div>
      <div tw="mt-6 w-full space-y-4 mb-5">
        <div tw="w-full flex items-center justify-between rounded-xl bg-info3 px-5 py-5">
          <div tw="flex flex-col">
            <p tw="flex-1" css={Style.text.smbold}>
              Bronze level
            </p>
            <p css={Style.text.smfull} tw="text-xs">
              &#8358;100,000 Worth of Trades
            </p>
          </div>
          <Image
            src="/img/levels/bronzeicon.svg"
            width={32}
            height={32}
            alt="bronze level"
          />
        </div>
        <div tw="w-full flex items-center justify-between rounded-xl bg-primaryblue4 px-5 py-5">
          <div tw="flex flex-col">
            <p tw="flex-1" css={Style.text.smbold}>
              Silver Level
            </p>
            <p css={Style.text.smfull} tw="text-xs">
              &#8358;500,000 Worth of Trades
            </p>
          </div>
          <Image
            src="/img/levels/silvericon.svg"
            width={32}
            height={32}
            alt="silver level"
          />
        </div>
        <div tw="w-full flex items-center justify-between rounded-xl bg-yellow/10 px-5 py-5">
          <div tw="flex flex-col">
            <p tw="flex-1" css={Style.text.smbold}>
              Gold level
            </p>
            <p css={Style.text.smfull} tw="text-xs">
              &#8358;1,000,000 Worth of Trades
            </p>
          </div>
          <Image
            src="/img/levels/goldicon.svg"
            width={32}
            height={32}
            alt="gold level"
          />
        </div>

        <div tw="w-full flex items-center justify-between rounded-xl bg-black6 px-5 py-5">
          <div tw="flex flex-col">
            <p tw="flex-1" css={Style.text.smbold}>
              Diamond level
            </p>
            <p css={Style.text.smfull} tw="text-xs">
              &#8358;2,000,000 Worth of Trades
            </p>
          </div>
          <Image
            src="/img/levels/diamondicon.svg"
            width={32}
            height={32}
            alt="diamond lvel"
          />
        </div>

        <div tw="w-full flex items-center justify-between rounded-xl bg-danger3/50 px-5 py-5">
          <div tw="flex flex-col">
            <p tw="flex-1" css={Style.text.smbold}>
              Chief level
            </p>
            <p css={Style.text.smfull} tw="text-xs">
              &#8358;5,000,000 Worth of Trades
            </p>
          </div>
          <Image
            src="/img/levels/chieficon.svg"
            width={32}
            height={32}
            alt="chief level"
          />
        </div>
        <div tw="w-full flex items-center justify-between rounded-xl bg-success1/10 px-5 py-5">
          <div tw="flex flex-col">
            <p tw="flex-1" css={Style.text.smbold}>
              Chief level
            </p>
            <p css={Style.text.smfull} tw="text-xs">
              &#8358;10,000,000 Worth of Trades
            </p>
          </div>
          <Image
            src="/img/levels/kingicon.svg"
            width={32}
            height={32}
            alt="king level"
          />
        </div>
      </div>
    </>
  )
}

UserRanking.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back />
      <AppTab />
      <div tw="w-full px-4 py-3">{page}</div>
    </Layout>
  )
}

export default UserRanking
