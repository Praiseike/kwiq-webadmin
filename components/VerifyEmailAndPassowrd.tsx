import { useEffect, useRef, useState } from 'react'

import tw from 'twin.macro'

import { useForm } from '@mantine/form'
import {
  Button,
  TextInput,
  Badge,
  Alert,
  Text,
  Transition,
  PasswordInput,
} from '@mantine/core'
import {
  useNotifications,
  updateNotification,
  showNotification,
} from '@mantine/notifications'

import { AiOutlineExclamationCircle } from 'react-icons/ai'

import style from '../styles/Styles'

import axios from 'axios'
import { MdError, MdMarkEmailUnread } from 'react-icons/md'

import { BsCheck } from 'react-icons/bs'
import { mutate } from 'swr'
import { BiMessageError } from 'react-icons/bi'
import {
  successNotification,
  unsuccessfullNotification,
} from '../libs/notifications'

export interface VerifyProps {
  form: any
  verifyType: 'addbank'
  setShow?: React.Dispatch<React.SetStateAction<boolean>>
  setShowWithdraw?: (state: boolean) => void
  //verficationCodeSetter?: React.Dispatch<React.SetStateAction<string>>
}

//The component at which a user is actually created
export default function VerifyEmailAndPassowrd({
  form: formValues,
  verifyType,
  setShow,
  setShowWithdraw,
}: VerifyProps) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const controller = new AbortController()

  useEffect(() => {
    sendVerificationEmail()
    return () => {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const formVerify = useForm({
    initialValues: {
      verificationcode: '',
      password: '',
    },
    validate: {
      verificationcode: value =>
        value.trim().length == 5
          ? null
          : 'The verifivation should be a 5 digit code',
      password: value =>
        value.trim().length > 1 ? null : 'Please enter your password',
    },
  })
  const handleVerificationSubmit = async () => {
    setLoading(true)
    if (formVerify.validate()) {
      if (verifyType == 'addbank') {
        try {
          const response = await axios.patch('/api/make-account-default', {
            accountNumber: formValues?.accountNumber,
            password: formVerify.values.password,
            verificationCode: formVerify.values.verificationcode,
          })
          if (response.status == 200) {
            setLoading(false)
            successNotification({
              message: 'Account saved as default succesfully',
            })

            setShowWithdraw?.(false)
            setShow?.(false)
            mutate('/api/me')
          }
        } catch (e: any) {
          setLoading(false)
          unsuccessfullNotification({ message: e.response.data.data.message })
        }
      }
    }
  }

  const sendVerificationEmail = async () => {
    setResendLoading(true)
    successNotification({ message: 'Success', title: 'Sent verification code' })

    try {
      await axios
        .post('/api/send-verification-code', '', {
          signal: controller.signal,
        })
        .then(res => {
          if (res.status == 200) {
            setResendLoading(false)
            updateNotification({
              id: 'resend',
              color: 'green',
              title: 'Email sent',
              message: res.data.data.message,
              radius: 'md',
              style: tw`backdrop-blur-sm bg-green-400/60 `,
              icon: <MdMarkEmailUnread />,
              autoClose: 8000,
            })
          }
        })
    } catch (e: any) {
      setResendLoading(false)
      updateNotification({
        id: 'resend',
        color: 'red',
        title: 'Error',
        message: e?.data?.data?.message,
        radius: 'md',
        style: tw`backdrop-blur-sm bg-red-400/60 `,
        icon: <BiMessageError />,
        autoClose: 5000,
      })
    }
  }

  return (
    <>
      <Alert
        radius="md"
        styles={{ message: tw`text-primary text-xs` }}
        icon={<AiOutlineExclamationCircle size={16} />}
      >
        Please provide the 5 digit verification code sent to your email in the
        input box below
      </Alert>

      <form
        onSubmit={formVerify.onSubmit(handleVerificationSubmit)}
        action="https://kings-cards-staging.herokuapp.com/api/v1/user/login"
        tw="py-5 flex flex-col space-y-5"
      >
        <TextInput
          required
          type="number"
          placeholder="Verification code"
          {...formVerify.getInputProps('verificationcode')}
          size="xl"
          onBlur={() => formVerify.validateField('verificationcode')}
          styles={{
            input: style.input.bold,
            error: style.input.error,
          }}
        />

        <PasswordInput
          required
          placeholder="Password"
          {...formVerify.getInputProps('password')}
          onBlur={() => formVerify.validateField('password')}
          size="xl"
          variant="unstyled"
          styles={{
            input: style.input.base,
            error: style.input.error,
          }}
        />

        <Button
          loading={loading}
          tw="bg-primary"
          size="lg"
          mt="xl"
          fullWidth
          type="submit"
        >
          Verify
        </Button>
        <div tw="flex items-center justify-between w-full">
          <Text css={style.text.sm} tw="text-gray2">
            Didn&apos;t get a code?
          </Text>
          <Badge
            disabled={resendLoading}
            component="button"
            onClick={sendVerificationEmail}
            tw="text-primary  normal-case font-medium px-2 py-3 cursor-pointer"
          >
            Resend code
          </Badge>
        </div>
      </form>
    </>
  )
}
