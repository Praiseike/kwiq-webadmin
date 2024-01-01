import * as React from 'react'
import tw from 'twin.macro'
import Image from 'next/image'
import { Badge, Box } from '@mantine/core'
import { useRouter } from 'next/router'
import Link from 'next/link'

export interface StoreProps {
  previousRoute?: string
  children?: React.ReactElement
  rightDiv?: React.ReactElement
  title?: React.ReactElement
  middle?: React.ReactElement
}

const Back = ({
  previousRoute,
  title,
  rightDiv,
  children,
  middle,
}: StoreProps) => {
  const router = useRouter()
  return (
    <>
      <div tw=" flex w-full justify-between items-center px-4 pt-5">
        <div tw="inline-flex space-x-4 cursor-pointer">
          <Image
            src={'/img/back.svg'}
            width="24"
            height="24"
            onClick={() => router.back()}
            alt="back"
          />
          {title}
        </div>
        <div tw="flex-1">{middle}</div>
        <div>{rightDiv}</div>
      </div>
      {children}
    </>
  )
}

export default Back
