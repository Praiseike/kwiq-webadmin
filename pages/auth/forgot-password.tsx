import tw from 'twin.macro'
import * as React from 'react'
import { ReactElement, useEffect, useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'

import { getSession } from 'next-auth/react'

import Layout from '../../layouts/layout'
import style from '../../styles/Styles'

import { Button, TextInput, Badge, Alert, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import Verify from '../../components/VerifyEmail'

import PasswordReset from '../../components/PasswordReset'

//import { axios } from '../../libs/axios'
import axios from 'axios'
import { atomStep } from '../../stores'
import { useAtom } from 'jotai'

//import axios from 'axios';
import { MdError, MdMarkEmailUnread } from 'react-icons/md'

interface FrogotPasswordProps {}

const FrogotPassword = ({}: FrogotPasswordProps) => {
  //console.log(props.csrfToken) used tp keep track of progress
  useEffect(() => {
    setStepAtom(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ error?: string; message?: string }>({
    error: '',
    message: '',
  })
  const [step, setStep] = useState(1)
  const [stepAtom, setStepAtom] = useAtom(atomStep)
  const [verificationCode, setVerificationcode] = useState('')

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: value =>
        /^\S+@\S+$/.test(value) ? null : 'Please enter a valid email',
    },
  })
  const handleSubmit = async () => {
    const validated = form.validate()
    if (validated) {
      setLoading(true)
      try {
        const response = await axios.post('/api/user-password-request', {
          email: form.values.email,
        })
        if (response.status == 200) {
          setMessage({ message: response?.data.data.message })
          setLoading(false)
          setStepAtom(2)
        }
      } catch (e: any) {
        setLoading(false)
        setMessage({ error: e.response?.data.data.message })
      }
    }
  }
  return (
    <>
      <div id="top" tw="flex flex-col w-full justify-center px-4 py-5">
        <div id="first" tw="flex w-full justify-between">
          <div tw="cursor-pointer">
            <Image
              src={'/img/back.svg'}
              width="24"
              height="24"
              alt=""
              onClick={() => {
                if (stepAtom == 1) {
                  router.push('/auth/signin')
                }
                if (stepAtom > 1) {
                  setStepAtom(stepAtom - 1)
                }
              }}
            />
          </div>

          <div>
            {step >= 2 && (
              <Badge
                tw="bg-[#EEF8FF] text-[#279AED] normal-case font-normal"
                variant="filled"
              >
                {step == 2 && 'Step 2 of 3'}
                {step == 3 && 'Step 3 of 3'}
              </Badge>
            )}
          </div>
        </div>

        {stepAtom == 1 && (
          <>
            <div tw="w-full flex justify-center mt-20">
              <Image
                src="/img/forgotpasswordicon.svg"
                width={150}
                height={158}
                alt=""
              />
            </div>

            <div tw="mt-5">
              <Text css={[style.text.md]} tw="w-full font-normal">
                Forgot Password
              </Text>
              <Text
                css={[style.text.color.gray]}
                tw="text-black3 w-8/12 mx-auto text-center"
              >
                Enter your email to configure a new password
              </Text>
            </div>
            <form
              onSubmit={form.onSubmit(handleSubmit)}
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
                  icon={<MdMarkEmailUnread size={16} />}
                  title="Success!"
                  color="green"
                >
                  {message.message}
                </Alert>
              )}
              <TextInput
                required
                placeholder="Email"
                {...form.getInputProps('email')}
                onBlur={() => form.validateField('email')}
                size="xl"
                styles={{
                  input: style.input.base,
                  error: style.input.error,
                }}
              />
              <div>
                <Button
                  loading={loading}
                  tw="bg-primary mt-32"
                  size="lg"
                  fullWidth
                  type="submit"
                >
                  Confirm
                </Button>
              </div>
            </form>
          </>
        )}
        <div tw="mt-10">
          {stepAtom == 2 && (
            <Verify
              form={form.values}
              verifyType="forgot-password"
              verficationCodeSetter={setVerificationcode}
            />
          )}
          {stepAtom == 3 && (
            <PasswordReset form={form.values} code={verificationCode} />
          )}
        </div>
      </div>
    </>
  )
}

FrogotPassword.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {/*  <Back  rightDiv={ <div>{<Badge tw="bg-[#EEF8FF] text-[#279AED] normal-case font-normal px-2 py-3" variant="filled">Step 1 of 3</Badge>}</div>}>
            {page}
            </Back> */}
      {page}
    </Layout>
  )
}
export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {
      session,
    },
  }
}
export default FrogotPassword
