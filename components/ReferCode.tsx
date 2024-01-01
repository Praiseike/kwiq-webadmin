import * as React from 'react'

import Image from 'next/image'
import { useRouter } from 'next/router'

import tw from 'twin.macro'
import style from '../styles/Styles'

import { TextInput, Input } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'

import { useEffect, useState } from 'react'
import { showNotification, useNotifications } from '@mantine/notifications'
import { MdCheck } from 'react-icons/md'
import { NumericFormat } from 'react-number-format'
import useSWR from 'swr'
import { fetcher } from '../hooks/api'

export interface ReferCodeProps {
  me: any
  handleClose?: any
}

export default function ReferCode({ me, handleClose }: ReferCodeProps) {
  const notifications = useNotifications()
  const router = useRouter()
  const [referalCode, setReferalCode] = useState('')
  const { data: bonusAmount } = useSWR('/api/fetch-bonus-amount', fetcher)
  const { data , error } = useSWR('/api/fetch-referrers-count',fetcher);

  const referralsCount = data?.data.data || 0;

  useEffect(() => {
    setReferalCode(me?.referralCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.referralCode])

  const clipboard = useClipboard({ timeout: 500 })
  useEffect(() => {
    if (clipboard.copied) {
      showNotification({
        title: 'Copied',
        message: 'Copied to clipboard',
        color: 'green',
        autoClose: 5000,
        icon: <MdCheck />,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clipboard.copied])
  return (
    <>
      <div tw="flex w-full items-center ">
        <div tw="flex items-baseline py-3">
          <Image
            src={'/img/back.svg'}
            width="24"
            height="24"
            onClick={() => (handleClose ? handleClose(false) : router.back())}
            alt="back icon"
          />
        </div>
      </div>
      <div tw="w-full flex flex-col justify-center ">
        <Image
          tw="mx-auto"
          src="/img/referbg.svg"
          width={161}
          height={193}
          alt="refer background"
        />

        <p css={style.text.md} tw="w-full font-medium mt-5">
          Refer a friend
        </p>
        <p css={style.text.smfull} tw="w-4/5 mx-auto text-lg">
          Refer a friend and earn ₦500 for every $1,000 they trade
        </p>

        <Input.Wrapper tw=" relative mt-5 ">
          <TextInput
            size="xl"
            value={referalCode}
            contentEditable="false"
            readOnly={true}
            rightSection={
              <p
                onClick={() => clipboard.copy(referalCode)}
                tw="text-gray2 rounded-2xl bg-primary4 font-medium px-3 py-2 mr-11 text-sm cursor-pointer"
                css={clipboard.copied ? tw`bg-green-300` : ''}
              >
                Copy
              </p>
            }
            styles={{
              input: style.input.referal,
            }}
            tw="relative rounded-full shadow-md text-lg"
          />
          <span tw="absolute top-[7px] left-[17px] text-xs text-black3">
            Referal code
          </span>
        </Input.Wrapper>
        <div tw="px-3 py-5 space-y-5">
          <div tw="flex justify-between">
            <h2 tw="text-lg">Total Rewards Earned</h2>
            <NumericFormat
              thousandsGroupStyle="thousand"
              tw="text-lg"
              value={me?.referrerBonusSum}
              prefix="₦"
              decimalSeparator="."
              displayType="text"
              type="text"
              thousandSeparator={true}
              allowNegative={true}
            />
          </div>
          <div tw="flex justify-between">
            <h2 tw="text-lg">Sign ups</h2>
            <h2 tw="text-lg">{referralsCount}</h2>
          </div>

          <div tw="flex justify-between">
            <h2 tw="text-lg">Sign ups with eligible transactions</h2>
            {/* 
              if referal count = 0 return 0;
              if 
             */}
            <h2 tw="text-lg">
              {referralsCount === 0? 0 : 
                me.totalReferrerRewards &&  
                (Math.trunc(me.totalReferrerRewards / referralsCount))}
            </h2>
          </div>

          <div tw="flex justify-between">
            <h2 tw="text-lg">Earning per referral</h2>
            <h2 tw="text-lg">₦{bonusAmount?.data.data.doc.referrerAmount}</h2>
          </div>
        </div>
      </div>
    </>
  )
}
