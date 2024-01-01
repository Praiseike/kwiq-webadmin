import * as React from 'react'
import tw from 'twin.macro'

import { Drawer, Group, Loader } from '@mantine/core'

import { useState } from 'react'

export interface SuccessMessageProps {
  message?: string
}

export default function LoadingScreen({ message }: SuccessMessageProps) {
  const [close, setClose] = useState(false)

  return (
    <>
      <Drawer
        opened={true}
        withCloseButton={false}
        onClose={() => setClose(true)}
        size="full"
        zIndex={40}
      >
        <div tw="flex flex-col h-screen place-items-center justify-center items-center">
          <Loader />
        </div>
      </Drawer>
    </>
  )
}
