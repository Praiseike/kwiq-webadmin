import * as React from 'react'

import Link from 'next/link'

import tw from 'twin.macro'

import { useForm } from '@mantine/form'
import { Button, TextInput, Badge, Alert, Text } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'

import { AiOutlineExclamationCircle } from 'react-icons/ai'

import style from '../styles/Styles'
import { useState } from 'react'
import axios from 'axios'
import { axiosraw } from '../libs/axios'

import { atomStep } from '../stores'
import { useAtom } from 'jotai'
import { signIn } from 'next-auth/react'
import {
  successNotification,
  unsuccessfullNotification,
} from '../libs/notifications'
import { useRouter } from 'next/router'

export interface VerifyProps {
  form: any
  verifyType: 'forgot-password' | 'register'
  verficationCodeSetter?: React.Dispatch<React.SetStateAction<string>>
}

//The component at which a user is actually created
export default function Verify({
  form: formValues,
  verifyType,
  verficationCodeSetter,
}: VerifyProps) {
  const notifications = useNotifications()

  const [loading, setLoading] = useState(false)

  const [stateMessage, setStateMessage] = useState('Verify')

  const [, setStepAtom] = useAtom(atomStep)

  const router = useRouter();

  const formVerify = useForm({
    initialValues: {
      verificationcode: '',
    },
    validate: {
      verificationcode: value =>
        value.trim().length == 5
          ? null
          : 'The verifivation should be a 5 digit code',
    },
  })
  const handleVerificationSubmit = async () => {
    if (verifyType === 'register' && formVerify.validate()) {
      setLoading(true)
      //console.log(formValues)
      try {
        const response = await axios.post('/api/auth/register', {
          email: formValues.email,
          phone: formValues.phone,
          password: formValues.password,
          firstName: formValues.firstname,
          lastName: formValues.lastname,
          verificationCode: formVerify.values.verificationcode,
          referralCode:
            formValues.referal.length > 0 ? formValues.referal : 'rrxxy',
        })
        if (response.status == 200) {
          // setLoading(false)
          successNotification({ message: 'Registered succesfully' })
          setStateMessage('Redirecting...');

          //sign in quielty
          const res = await signIn('credentials', {
            userId: formValues.email,
            password: formValues.password,
            // callbackUrl: `${window.location.origin}/`,
            redirect: false, //no redirect as we still want to add an account
          })

          // router.push('/');

        }
      } catch (e: any) {
        setLoading(false)
        unsuccessfullNotification({ message: e?.response.data.data.message })
      }
    }

    if (verifyType == 'forgot-password') {
      try {
        const response = await axios.patch(
          '/api/user-password-reset',

          {
            email: formValues.email,
            password: 'password1',
            verificationCode: formVerify.values.verificationcode,
          },
        )
        if (response.status == 200) {
          setLoading(false)

          setStepAtom(3)
          verficationCodeSetter?.(formVerify.values.verificationcode)
        }
      } catch (e: any) {
        setLoading(false)
        unsuccessfullNotification({ message: e?.response.data.data.message })
      }
    }
  }

  const sendVerificationEmail = async () => {
    if (verifyType == 'register') {
      try {
        const response = await axios.post('/api/auth/send-verification-email', {
          email: formValues.email,
        })
        if (response.status == 200) {
          successNotification({ message: response.data.data.message })
        }
      } catch (e: any) {
        unsuccessfullNotification({ message: e?.response.data.data.message })
      }
    }

    if (verifyType == 'forgot-password') {
      try {
        const response = await axios.post('/api/user-password-request', {
          email: formValues.email,
        })
        if (response.status == 200) {
          successNotification({ message: response.data.data.message })
        }
      } catch (e: any) {
        //setLoading(false)
        unsuccessfullNotification({ message: e?.response.data.data.message })
      }
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
        tw="py-5 flex flex-col space-y-5"
      >
        <TextInput
          required
          type="number"
          placeholder="Verification code"
          {...formVerify.getInputProps('verificationcode')}
          onBlur={() => formVerify.validateField('verificationcode')}
          size="xl"
          styles={{
            input: style.input.bold,
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
          {stateMessage}
        </Button>
        <div tw="flex items-center justify-between w-full">
          <Text css={[style.text.sm]} tw="text-gray2">
            Didn&apos;t get a code?
          </Text>
          <Badge
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
