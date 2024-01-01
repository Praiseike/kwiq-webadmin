import Image from 'next/image'
import Link from 'next/link'

import tw, { css } from 'twin.macro'
import React, { ReactElement, useEffect, useState } from 'react'

import Layout from '../layouts/layout'
import AppTab from '../layouts/home'
import Back from '../layouts/back'
import style from '../styles/Styles'

import { Avatar, Button, Drawer, Input, Text, TextInput } from '@mantine/core'

import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import { useForm } from '@mantine/form'
import { useMe } from '../hooks/api'
import axios from 'axios'
import { useSWRConfig } from 'swr'

import { useAtom } from 'jotai'
import { activeHomeTabAtom } from '../stores'

import LoadingScreen from '../components/LoadingScreen'

interface IProfileProps {}

const Profile = ({}: IProfileProps) => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)

  useEffect(() => {
    setActiveTab('Settings')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { me, isLoading } = useMe()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [disableFirstName, setDisableFirstName] = useState(true)
  const [disableLastName, setDisableLastName] = useState(true)
  const [disablePhone, setDisablePhone] = useState(true)
  //const [disablEmail, setDisableEmail] = useState(true)

  const { mutate } = useSWRConfig()

  const level = getLevel(me?.totalApprovedTransactions)

  useEffect(() => {
    form.setFieldValue('firstname', me?.firstName)
    form.setFieldValue('lastname', me?.lastName)
    form.setFieldValue('phone', me?.phone)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me])

  useEffect(() => {
    if (
      disablePhone == false ||
      disableLastName == false ||
      disableFirstName == false
    ) {
      setEditing(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disablePhone, disableFirstName, disableLastName])

  const form = useForm({
    initialValues: {
      firstname: '',
      lastname: '',
      phone: '',
    },

    validate: {
      firstname: value =>
        value?.trim().length >= 2
          ? null
          : 'First name must include at least 2 characters',
      lastname: value =>
        value?.trim().length >= 2
          ? null
          : 'Last name must include at least 2 characters',
      phone: value =>
        isValidPhoneNumber(value + '') ? null : 'Enter a valid number',
    },
  })

  const handleSubmit = async () => {
    if (form.validate()) {
      setLoading(true)
      try {
        const response = await axios.patch(
          '/api/update-user',

          {
            firstName: form.values.firstname,
            lastName: form.values.lastname,
            phone: form.values.phone,
          },
        )
        if (response.status == 200) {
          setLoading(false)
          setEditing(false)
          setDisableFirstName(true)
          setDisableLastName(true)
          setDisablePhone(true)
          mutate('/api/me')
        }
      } catch (e: any) {
        //setLoading(false)
        //setError(e.response.data.data.message)
        setLoading(false)
        //console.log(e)
      }
    }
  }

  if (isLoading) return <LoadingScreen />
  return (
    <>
      <div tw="w-full flex justify-between px-4 py-3">
        <div tw="inline-flex items-center space-x-1">
          <Avatar
            tw="cursor-pointer"
            src={''}
            radius="xl"
            size={42}
            alt={`${me?.lastName} ${me?.firstName}`}
            color="gray"
          >
            {me?.lastName.charAt(0)}
            {me?.firstName.charAt(0)}
          </Avatar>
          <div tw="block ml-2">
            <Text css={style.text.smbold}>
              {me?.lastName} {me?.firstName}{' '}
            </Text>
            <p tw="text-sm text-black2 ">User level</p>
          </div>
        </div>
        <div tw="flex flex-col justify-center items-center p-3 rounded-xl bg-black6">
          <Image
            src={`/img/levels/${level}icon.svg`}
            width={32}
            height={32}
            alt="level"
          />
          <p tw="capitalize [font-size:10px] text-black2">{level}</p>
        </div>
      </div>
      <hr tw="w-full h-1 bg-gray9 border-b-2 border-gray9" />
      <div tw="w-full px-4 py-3">
        <p css={[style.text.md, style.text.color.black1]} tw="mt-3">
          User details
        </p>
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          action=""
          tw="w-full py-3 flex flex-col"
        >
          <Input.Wrapper tw=" relative ">
            <TextInput
              required
              tw="relative"
              placeholder="First name"
              {...form.getInputProps('firstname')}
              disabled={disableFirstName}
              size="xl"
              onBlur={() => form.validateField('firstname')}
              rightSection={
                <p
                  onClick={() => setDisableFirstName(false)}
                  tw="text-primary font-normal px-4 text-xs"
                >
                  Edit
                </p>
              }
              styles={{
                input: style.input.edit,
                error: style.input.error,
              }}
            />
            <span tw="absolute top-[7px] left-[17px] text-xs text-black3">
              First name
            </span>
          </Input.Wrapper>

          <Input.Wrapper tw=" relative mt-5">
            <TextInput
              required
              tw="relative"
              disabled={disableLastName}
              placeholder="Last name"
              {...form.getInputProps('lastname')}
              size="xl"
              onBlur={() => form.validateField('lastname')}
              rightSection={
                <p
                  onClick={() => setDisableLastName(false)}
                  tw="text-primary font-normal px-4 text-xs"
                >
                  Edit
                </p>
              }
              styles={{
                input: style.input.edit,
                error: style.input.error,
              }}
            />
            <span tw="absolute top-[7px] left-[17px] text-xs text-black3">
              Last name
            </span>
          </Input.Wrapper>

          <Input.Wrapper tw=" relative mt-5">
            <TextInput
              required
              tw="relative"
              placeholder="Email"
              disabled
              value={me?.email}
              size="xl"
              styles={{
                input: style.input.edit,
                error: style.input.error,
              }}
            />
            <span tw="absolute top-[7px] left-[17px] text-xs text-black3">
              Email
            </span>
          </Input.Wrapper>

          <Input.Wrapper
            onBlur={() => form.validateField('phone')}
            error={form.errors.phone}
            tw=" relative mt-5"
          >
            <PhoneInput
              {...form.getInputProps('phone')}
              defaultCountry="NG"
              disabled={disablePhone}
              tw="bg-[#f3f4f6] relative "
              css={tw`px-4 py-4  h-[50px] rounded-xl bg-[#f3f4f6] border-0 text-black1 text-sm`}
              id="phone-input"
            />
            <p
              onClick={() => setDisablePhone(false)}
              tw="absolute top-[17px] -right-2 text-primary font-normal px-4 text-xs"
            >
              Edit
            </p>
          </Input.Wrapper>

          <div>
            {editing && (
              <Button
                loading={loading}
                tw="bg-primary mt-3"
                size="lg"
                fullWidth
                type="submit"
              >
                Update
              </Button>
            )}
          </div>
        </form>
      </div>

      <style global jsx>
        {`
          .PhoneInputInput {
            flex: 1 1;
            min-width: 0;
            padding: 5px;
            background-color: #f3f4f6;
            border: none;
          }
          .PhoneInputInput:focus,
          .PhoneInputInput:focus-within {
            flex: 1 1;
            min-width: 0;
            padding: 5px;
            border: 0px;
            outline: none;
          }
        `}
      </style>
    </>
  )
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <div tw="w-full">
        <Back />
      </div>
      <AppTab />
      {/* <div tw="px-4 py-5"> */}
      {page}
    </Layout>
  )
}

const getLevel = (amount: number) => {
  let level = ''

  if (amount < 100000) {
    level = 'beginner'
  } else if (amount < 500000) {
    level = 'bronze'
  } else if (amount < 1000000) {
    level = 'silver'
  } else if (amount < 2000000) {
    level = 'gold'
  } else if (amount < 5000000) {
    level = 'diamond'
  } else if (amount < 10000000) {
    level = 'chief'
  } else {
    level = 'king'
  }

  return level
}
export default Profile
