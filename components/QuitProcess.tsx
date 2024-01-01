import * as React from 'react'

import Image from 'next/image'

import tw, { css } from 'twin.macro'
import style from '../styles/Styles'

import {
  Button,
  TextInput,
  Checkbox,
  Text,
  Select,
  Affix,
  Transition,
  Input,
} from '@mantine/core'
import { useForm } from '@mantine/form'

export interface ConfirmAccountProps {
  label: string
  description: string
}

export default function ConfirmAccount({
  label,
  description,
}: ConfirmAccountProps) {
  const form = useForm({
    initialValues: {
      bank: '',
      account: '',
      makedefault: false,
    },

    validate: {
      bank: value => (value.trim().length > 0 ? null : 'Please select a bank'),
      account: value =>
        value.trim().length > 10
          ? null
          : 'Account number should be at least 10 digit number',
    },
  })
  return (
    <>
      <div tw="">
        <Input.Wrapper tw="" label={label} description={description}>
          {''}
        </Input.Wrapper>
      </div>
      <div tw="w-full flex flex-row space-x-3 mt-10">
        <Button
          tw="text-red-500 bg-transparent border-[1px] border-gray-400"
          radius="md"
          size="xl"
          fullWidth
          type="submit"
        >
          Nope
        </Button>
        <Button tw="bg-primary " size="lg" fullWidth type="submit">
          Yes Please
        </Button>
      </div>
    </>
  )
}
