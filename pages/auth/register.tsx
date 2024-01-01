import { ReactElement, useEffect, useState } from 'react'

import Layout from '../../layouts/layout'
import tw from 'twin.macro'
import style from '../../styles/Styles'

import Image from 'next/image'
import Link from 'next/link'
import { GetServerSideProps } from 'next'

import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import { useForm } from '@mantine/form'
import {
  Button,
  Input,
  TextInput,
  Badge,
  PasswordInput,
  Text,
  Drawer,
} from '@mantine/core'

import axios from 'axios'

import AddBank from '../../components/AddBank'
import Verify from '../../components/VerifyEmail'

import { useAtom } from 'jotai'
import { atomStep } from '../../stores'
//import { getStared } from '../../stores'

import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import {
  successNotification,
  unsuccessfullNotification,
} from '../../libs/notifications'

export interface RegisterProps {}

const Register = ({}: RegisterProps) => {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [showQuit, setShowQuit] = useState(false)
  //const [, set] = useAtom(getStared)

  const [stepAtom, setStepAtom] = useAtom(atomStep) //used to keep track of the progress registration
  useEffect(() => {
    setStepAtom(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const form = useForm({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      phone: '',
      referal: '',
    },
    validate: {
      firstname: value =>
        value.trim().length >= 2
          ? null
          : 'First name must include at least 2 characters',
      lastname: value =>
        value.trim().length >= 2
          ? null
          : 'Last name must include at least 2 characters',
      email: value =>
        /^\S+@\S+$/.test(value) ? null : 'Supplied email is not valid',
      password: value =>
        value.trim().length >= 8
          ? null
          : 'Password shoould contain at least 8 chararcters',
      phone: value =>
        isValidPhoneNumber(value + '') ? null : 'Enter a valid number',
    },
  })

  const handleSubmit = async () => {
    if (form.isValid()) {
      setLoading(true)
      try {
        const email = form.values.email
        const response = await axios.post('/api/auth/send-verification-email', {
          email,
        })
        console.log(response);
        if (response.status == 200) {
          successNotification({
            message: `Verification code sent to ${email} please check your inbox as code expires in 10 minutes`,
          })

          setLoading(false)
          setStepAtom(2)
        }
      } catch (e: any) {
        console.log("error",e)
        unsuccessfullNotification({message: e?.response.data.data.message.toString()})
        setLoading(false)
      }
    }
  }

  // const handleSubmit = () => {
  //   if(form.isValid()){
  //     setLoading(true)
  //     const email = form.values.email;
  //     axios.post('/api/auth/send-verification-email', { email })
  //       .then(response => {
  //         if (response.status == 200) {
  //           successNotification({
  //             message: `Verification code sent to ${email} please check your inbox as code expires in 10 minutes`,
  //           })

  //           setLoading(false)
  //           setStepAtom(2)
  //         }       
  //       })
  //       .catch(error => {
  //         unsuccessfullNotification({message: error?.response?.data?.data?.message })
  //         // unsuccessfullNotification(error.response.data.data.message);
  //       })
  //       .finally(() => setLoading(false));
  //   }
  // }
  return (
    <>
      <Drawer
        opened={showQuit}
        position="bottom"
        padding="xs"
        withCloseButton
        size={200}
        onClose={() => setShowQuit(false)}
        tw="rounded-tr-xl rounded-tl-xl"
      >
        <Text tw="">Are you sure you want to quit this process?</Text>
        <div tw="w-full flex flex-row space-x-3 mt-10">
          <Button
            onClick={() => setShowQuit(false)}
            tw="text-red-500 bg-transparent border-[1px] border-gray-400"
            radius="md"
            size="lg"
            fullWidth
            type="submit"
          >
            Nope
          </Button>

          <Button
            onClick={() => {
              //set(true)
              router.replace('/auth/signin')
            }}
            tw="bg-primary "
            size="lg"
            fullWidth
            type="submit"
          >
            Yes Please
          </Button>
        </div>
      </Drawer>
      <div tw="flex flex-col w-full pb-5 justify-center">
        <div tw="flex w-full justify-between">
          <div tw="cursor-pointer">
            <Image
              src={'/img/back.svg'}
              width="24"
              height="24"
              alt=""
              onClick={() => {
                if (stepAtom <= 3) {
                  setShowQuit(true)
                } else {
                  //will not happen beacuse if you dont register you cant comfirm code
                  //will request for a chnage if insisted here
                  setStepAtom(stepAtom - 1)
                }
              }}
            />
          </div>
          <div>
            {
              <Badge
                tw="bg-[#EEF8FF] text-[#279AED] normal-case font-normal px-2 py-3"
                variant="filled"
              >
                {stepAtom == 1 && 'Step 1 of 3'}
                {stepAtom == 2 && 'Step 2 of 3'}
                {stepAtom == 3 && 'Step 3 of 3'}
              </Badge>
            }
          </div>
        </div>

        {stepAtom == 1 && (
          <>
            <Image
              tw="mx-auto"
              src="/img/signupicon.svg"
              width={81}
              height={98}
              alt=""
            />
            <div tw="mt-5">
              <Text css={[style.text.md]} tw="w-full font-normal">
                Sign up and jump right in
              </Text>
              <Text css={[style.text.sm]} tw="text-black3">
                Please enter the details to signup{' '}
              </Text>
            </div>
            <form
              onSubmit={form.onSubmit(handleSubmit)}
              action=""
              tw="py-5 flex flex-col space-y-5"
            >
              <TextInput
                required
                placeholder="First name"
                {...form.getInputProps('firstname')}
                size="xl"
                onBlur={() => form.validateField('firstname')}
                styles={{
                  input: style.input.base,
                  error: style.input.error,
                }}
              />
              <TextInput
                required
                placeholder="Last name"
                {...form.getInputProps('lastname')}
                onBlur={() => form.validateField('lastname')}
                size="xl"
                styles={{
                  input: style.input.base,
                  error: style.input.error,
                }}
              />
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

              <PasswordInput
                required
                placeholder="Password"
                {...form.getInputProps('password')}
                onBlur={() => form.validateField('password')}
                size="xl"
                variant="unstyled"
                styles={{
                  input: style.input.base,
                  error: style.input.error,
                }}
              />
              <Input.Wrapper
                onBlur={() => form.validateField('phone')}
                error={form.errors.phone}
              >
                <PhoneInput
                  {...form.getInputProps('phone')}
                  onBlur={() => form.validateField('phone')}
                  defaultCountry="NG"
                  tw="bg-[#f3f4f6]"
                  css={tw`px-4 py-4  h-[60px] rounded-xl bg-[#f3f4f6] border-[1px] border-[#ced4da] text-sm`}
                  id="phone-input"
                />
              </Input.Wrapper>

              <TextInput
                placeholder="Referal code (optional)"
                {...form.getInputProps('referal')}
                size="xl"
                styles={{
                  input: style.input.base,
                  error: style.input.error,
                }}
              />
              <p tw="text-sm font-normal">
                By creating this account, you agree to our
                <span tw="text-blue-400"> Privacy Policy</span> and
                <Link href="/terms" passHref>
                  <span tw="text-blue-400"> Terms and Conditions</span>
                </Link>
              </p>
              <div>
                <Button
                  loading={loading}
                  tw="bg-primary mb-9"
                  size="lg"
                  fullWidth
                  type="submit"
                >
                  Create Account
                </Button>
              </div>
            </form>
          </>
        )}
        {stepAtom == 2 && (
          <div tw="mt-5">
            <Verify form={form.values} verifyType="register" />
          </div>
        )}
        {stepAtom == 3 && <AddBank mode="register" form={form.values} />}
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

Register.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {/*  <Back  rightDiv={ <div>{<Badge tw="bg-[#EEF8FF] text-[#279AED] normal-case font-normal px-2 py-3" variant="filled">Step 1 of 3</Badge>}</div>}>
            {page}
            </Back> */}
      <div tw="w-full px-4 py-5">{page}</div>
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
    props: { session },
  }
}

export default Register
