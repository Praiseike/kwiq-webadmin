import tw from 'twin.macro'

import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
dayjs.extend(relativeTime)

import { FaBell } from 'react-icons/fa'
//created blue  aprroved green decline red

export interface ITransactiontItemProps {
  body: string
  createdAt: Date
  read: boolean
  title: string
  userId: string
  __v: number
  _id: string
}

export function NotificationList({
  body,
  title,
  createdAt,
  _id,
}: ITransactiontItemProps) {
  return (
    <div tw="w-full">
      <p tw="text-sm text-black1">
        {' '}
        {dayjs(createdAt).format('dddd, MMMM D, YYYY')}
      </p>

      <div tw="inline-flex flex-1 space-x-3 mt-2">
        <div tw="flex items-center justify-center h-8 w-8 rounded-full text-success1 bg-success1/40">
          <FaBell color="green" />
        </div>
        <div tw="block ">
          <p tw="font-medium text-lg text-black">{title}</p>
          <p tw="text-xs text-gray3">{body}</p>
        </div>
      </div>
      <div tw=" block justify-between items-end">
        {/* <Link passHref href={`/transaction/${_id}`}>
                        <p tw="text-[10px] text-blue1 cursor-pointer text-right">view details</p>
                    </Link> */}
      </div>
    </div>
  )
}
