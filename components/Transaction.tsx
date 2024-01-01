import Image from 'next/image'

import Style from '../styles/Styles'

import dayjs from 'dayjs'

import { NumericFormat } from 'react-number-format'

export interface ITransactionProps {
  amount: number
  charge: number
  comments: string
  createdAt: string
  currency: string
  iconType: string
  iconUrl: string
  images: []
  narration: string
  status: string
  tradeId: null | string
  type: string
  updatedAt: string
  userId: string
  vendor: string
  _id: string
}

const Transaction = (props: ITransactionProps) => {
  return (
    <>
      <div tw="w-full flex items-center justify-between mt-2">
        <p tw="text-black1 [font-size:18px] font-medium">Transaction details</p>
      </div>
      <div tw="flex flex-col justify-center mx-auto min-w-0 mt-3 px-5 pt-5 pb-3 bg-black6 rounded-lg">
        <Image
          src="/img/transactionicon.svg"
          width={108}
          height={112}
          alt="transaction icon"
        />

        <div tw=" flex justify-center mt-5">
          <p css={Style.text.md} tw="text-black1 w-9/12 ">
            {props?.narration}
          </p>
        </div>

        <div tw=" flex flex-col justify-center mt-5">
          <div tw="flex justify-between items-baseline [border-b:1px] border-black4 py-1">
            <p css={Style.text.sm} tw="text-black2">
              Transaction ID
            </p>
            <p css={Style.text.md} tw="font-medium [font-size:12px]">
              {props?._id}
            </p>
          </div>

          <div tw="flex justify-between items-baseline [border-b:1px] border-black4 py-1">
            <p css={Style.text.sm} tw="text-black2">
              Status
            </p>
            <p css={Style.text.md} tw="font-medium">
              {props?.status}
            </p>
          </div>

          <div tw="flex justify-between items-baseline [border-b:1px] border-black4 py-1">
            <p css={Style.text.sm} tw="text-black2">
              Date
            </p>
            <p css={Style.text.md} tw="font-medium">
              {dayjs(props?.createdAt).format('MMMM DD, YYYY H:m A')}
            </p>
          </div>

          <div tw="flex justify-between items-baseline py-1">
            <p css={Style.text.sm} tw="text-black2">
              Amount
            </p>
            <p css={Style.text.md} tw="font-medium">
              <NumericFormat
                css={[Style.text.md]}
                thousandsGroupStyle="thousand"
                value={props?.amount}
                prefix="₦"
                suffix=".00"
                decimalSeparator="."
                displayType="text"
                type="text"
                thousandSeparator={true}
                allowNegative={true}
              />
            </p>
          </div>
        </div>
      </div>

      {props?.comments && props?.comments.trim().length > 0 ? (
        <>
          <p tw="w-full text-black2 text-sm mt-3">Comments</p>
          <div tw="flex flex-col justify-center mx-auto min-w-0 mt-3 px-5 py-5 bg-black6 rounded-lg">
            <p css={Style.text.sm} tw="text-left text-black2">
              {props?.comments}
            </p>
          </div>
        </>
      ) : (
        <p tw="w-full text-black2 text-sm mt-3">No comments</p>
      )}
      {props?.images.length > 0 ? (
        <>
          <p tw="w-full text-black2 text-sm mt-3 mb-2">Attachment</p>

          <div tw="grid grid-cols-2 gap-2">
            {props?.images.map((item: any, index: number) => (
              <div key={index} tw="relative cursor-pointer">
                {/* leftSection */}
                <div tw=" items-center">
                  <Image src={item} width="155" height="99" alt="" />
                </div>
                {/*  <p tw="absolute top-0 left-0">nbvhvghgv</p> */}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p tw="w-full text-black2 text-sm mt-5">No attachment</p>
      )}
    </>
  )
}

export default Transaction
