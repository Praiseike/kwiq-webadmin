import { ReactElement, useEffect, useState } from 'react'
import Layout from '../layouts/layout'
import Back from '../layouts/back'

import Image from 'next/image'

import style from '../styles/Styles'
import { useForm } from '@mantine/form'
import { Button, Text, PasswordInput } from '@mantine/core'

import { Alert } from '@mantine/core'

import { axios } from '../libs/axios'
import { MdCheck, MdError } from 'react-icons/md'
import AppTab from '../layouts/home'

import { useAtom } from 'jotai'
import { activeHomeTabAtom } from '../stores'

interface ChangeEmailProps {}

const ChangeEmail = (props: ChangeEmailProps) => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('More')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const form = useForm({
    initialValues: {
      oldpassword: '',
      newpassword: '',
    },
    validate: {
      oldpassword: value =>
        value.trim().length >= 8
          ? null
          : 'Your old password length must be at least 8 characters long',
      newpassword: value =>
        value.trim().length >= 8
          ? null
          : 'Your new password length must be at least 8 characters long',
    },
  })

  const handleSubmit = async () => {
    if (form.validate()) {
      setLoading(true)
      try {
        const response = await axios.put('/api/user-password-change', {
          oldPassword: form.values.oldpassword,
          newPassword: form.values.newpassword,
        })
        if (response.status == 200) {
          setLoading(false)
          setMessage(response.data.data.message)
        }
      } catch (e: any) {
        setLoading(false)
        setError(e.response.data.data.message)
      }
    }
  }

  return (
    <>
      <div tw="flex flex-col w-full px-4 py-5 justify-center mt-5">
        {/*  {toggle && welcomeback}
      {!toggle && signin} */}
        <Image
          src="/img/change-passwordicon.svg"
          width="122"
          height="122"
          alt=""
        />

        <div tw="mt-5">
          <Text css={[style.text.md]} tw="w-full">
            Change your email
          </Text>
          {/*         <Text css={[style.text.sm]} tw="text-black3">Please enter your email address</Text>
           */}
        </div>
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          action=""
          tw="py-5 flex flex-col relative mt-8"
        >
          {error && (
            <Alert
              onClose={() => setError('')}
              withCloseButton
              tw="mb-4"
              icon={<MdError size={16} />}
              title="Error!"
              color="red"
            >
              {error}
            </Alert>
          )}
          {message && (
            <Alert
              onClose={() => setMessage('')}
              withCloseButton
              tw="mb-4"
              icon={<MdCheck size={16} />}
              title="Awesome!"
              color="green"
            >
              {message}
            </Alert>
          )}
          <PasswordInput
            required
            placeholder="Ente old password"
            variant="default"
            {...form.getInputProps('oldpassword')}
            onBlur={() => form.validateField('oldpassword')}
            size="xl"
            tw="mt-5"
            styles={{
              input: style.input.base,
              error: style.input.error,
            }}
          />
          <PasswordInput
            required
            placeholder="Enter new password"
            variant="default"
            {...form.getInputProps('newpassword')}
            onBlur={() => form.validateField('newpassword')}
            size="xl"
            tw="mt-5"
            styles={{
              input: style.input.base,
              error: style.input.error,
            }}
          />

          <Button
            loading={loading}
            tw="bg-primary mt-32"
            size="lg"
            mt="xl"
            fullWidth
            type="submit"
          >
            Confirm changes
          </Button>

          {/* <Link href="/auth/register">
        <a>
        </a>
      </Link> */}
        </form>
      </div>
    </>
  )
}

ChangeEmail.auth = false
ChangeEmail.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back />
      <AppTab />
      {page}
    </Layout>
  )
}

export default ChangeEmail
