import * as React from 'react'

import { useRouter } from 'next/router'
import tw, { css } from 'twin.macro'
import style from '../styles/Styles'

import { Text, Drawer, Group } from '@mantine/core'

import { useState } from 'react'
import { BsCheckCircleFill } from 'react-icons/bs'

export interface SuccessMessageProps {
  title: string
  redirectTo?: string
  message?: string
}

export default function SuccessMessage({
  message,
  title,
  redirectTo,
}: SuccessMessageProps) {
  const [counter, setCounter] = useState(5)
  const [close, setClose] = useState(false)

  const router = useRouter()

  React.useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000)
    if (counter == 0) {
      router.push(redirectTo ?? '/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter])
  return (
    <>
      <Drawer
        opened={true}
        withCloseButton={false}
        onClose={() => setClose(true)}
        size="full"
        padding="xs"
        zIndex={40}
      >
        <Group position="center">
          <div tw="flex flex-col h-screen justify-center items-center">
            <BsCheckCircleFill size="48" color="green" />

            <p tw="mt-14 [font-size:18px] text-black1 font-medium">{title}</p>
            {message && (
              <p tw="mt-1 text-sm text-center text-black2">{message}</p>
            )}
            <Text tw="text-sm text-primary">
              Redirecting you in {counter} seconds...
            </Text>
          </div>
        </Group>
      </Drawer>
    </>
  )
}
