import * as React from 'react'
import tw from 'twin.macro'

import Link from 'next/link'
import Image from 'next/image'

import { useForm } from '@mantine/form'
import { Button, Alert, Text, PasswordInput } from '@mantine/core'

import style from '../styles/Styles'
import { useState } from 'react'
import { MdCheck, MdError } from 'react-icons/md'
//import { axiosraw } from '../libs/axios'
import axios from 'axios'
import { useRouter } from 'next/router'
import SuccessMessage from './SuccesMessage'
export interface VerifyProps {
  code: string
  form: any
}

export default function PasswordReset({ code, form }: VerifyProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [message, setMessage] = useState<{ error?: string; message?: string }>({
    error: '',
    message: '',
  })

  const router = useRouter()

  const formPassword = useForm({
    initialValues: {
      password: '',
    },

    validate: {
      password: value =>
        value.trim().length >= 8
          ? null
          : 'Password must be at least 8 characters',
    },
  })

  const handleSubmit = async () => {
    if (formPassword.validate()) {
      setLoading(true)
      try {
        const response = await axios.patch(
          '/api/user-password-reset',

          {
            email: form.email,
            password: formPassword.values.password,
            verificationCode: code,
          },
        )
        if (response.status == 200) {
          setLoading(false)
          /*   setMessage({ message: response.data.message })
          setTimeout(() => {
            router.push('/auth/signin')
          }, 500) */
          setSuccess(true)
        }
      } catch (e: any) {
        setLoading(false)
        setMessage({ error: e.response?.data?.data?.message })
      }
    }
  }
  return (
    <>
      {success && (
        <SuccessMessage
          redirectTo="/auth/signin"
          title="Password Changed Successfully"
        />
      )}
      <Image
        src="/img/singinicon.svg"
        width={206}
        height={203}
        alt="sign in icon"
        tw="mx-auto"
      />

      <div tw="mt-5">
        <Text css={[style.text.md]} tw="w-full">
          Set a new password
        </Text>
        <Text css={style.text.sm} tw="text-black3">
          Please set a new password{' '}
        </Text>
      </div>

      <form
        onSubmit={formPassword.onSubmit(handleSubmit)}
        action=""
        tw="py-5 flex flex-col space-y-5"
      >
        {message?.error && (
          <Alert
            onClose={() => setMessage({ error: '' })}
            withCloseButton
            tw="mt-2"
            icon={true && <MdError size={16} />}
            title="Error!"
            color="red"
          >
            {message.error}
          </Alert>
        )}
        {message?.message && (
          <Alert
            onClose={() => setMessage({ message: '' })}
            withCloseButton
            tw="mt-2"
            icon={<MdCheck size={16} />}
            title="Awesome!"
            color="green"
          >
            {message.message}
          </Alert>
        )}
        <PasswordInput
          required
          placeholder="New paasword"
          {...formPassword.getInputProps('password')}
          size="xl"
          onBlur={() => formPassword.validateField('password')}
          styles={{
            input: style.input.base,
            error: style.input.error,
          }}
        />
        <div tw="">
          <Button
            loading={loading}
            tw="bg-primary mt-32"
            size="xl"
            fullWidth
            type="submit"
          >
            Comfirm password
          </Button>
        </div>
      </form>
    </>
  )
}
