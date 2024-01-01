import Image from 'next/image'

import Style from '../styles/Styles'

import { Text, Group } from '@mantine/core'

import tw from 'twin.macro'

interface ComingSoonProps {
  title?: string
  message?: string
}

export default function ComingSoon({ message, title }: ComingSoonProps) {
  return (
    <>
      <div tw="mt-10">
        <Group position="center">
          <Image
            tw="mx-auto"
            src="/img/comingsoon.svg"
            width={200}
            height={190}
            alt="coming soon"
          />

          <div tw="mt-5">
            <Text css={[Style.text.md]} tw="w-full">
              Coming soon
            </Text>
            <Text css={[Style.text.sm]} tw="text-black3 max-w-xs">
              We are currently making updates to our{' '}
              <span tw="font-medium text-black1">{message?.toUpperCase()}</span>{' '}
              transaction system.
            </Text>
          </div>
        </Group>
      </div>
    </>
  )
}
