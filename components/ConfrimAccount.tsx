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

import { FaChevronDown } from 'react-icons/fa'
const options = [
  { value: 'react', label: 'React' },
  { value: 'ng', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'vue', label: 'Vue' },
]
export interface ConfirmAccountProps {}

export default function ConfirmAccount(props: ConfirmAccountProps) {
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

  const handleSubmit = () => {}
  return (
    <>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        action=""
        tw="w-full px-4 py-5 flex flex-col space-y-5"
      >
        <div tw="">
          <Input.Wrapper
            tw=""
            label="Confirm account?"
            description="Please enter your password to confirm"
          >
            <TextInput
              required
              tw="relative"
              placeholder="Password"
              size="xl"
              styles={{
                input: style.input.base,
                error: style.input.error,
              }}
            />
          </Input.Wrapper>
        </div>
        <div tw="w-full flex flex-row space-x-3 mt-10">
          <Button
            tw="text-red-500 bg-transparent border-[1px] border-gray-400"
            radius="md"
            size="lg"
            fullWidth
            type="submit"
          >
            Cancel
          </Button>
          <Button tw="bg-primary " size="lg" fullWidth type="submit">
            Confirm
          </Button>
        </div>
      </form>
    </>
  )
}
