import { ReactElement, useState } from 'react'
import Layout from '../../layouts/layout'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { GetServerSideProps } from 'next'
import style from '../../styles/Styles'
import { useForm } from '@mantine/form'
import { TextInput, Button, Text, PasswordInput } from '@mantine/core'

import {
  successNotification,
  unsuccessfullNotification,
} from '../../libs/notifications'

import tw from 'twin.macro'

import { Alert } from '@mantine/core'

import { getSession, signIn, useSession } from 'next-auth/react'
import { MdError } from 'react-icons/md'
interface SignInProps {}

const SignIn = ({}: SignInProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()


  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: value =>
        /^\S+@\S+$/.test(value) ? null : 'Please enter your email',
      password: value =>
        value.trim().length > 1 ? null : 'Please enter your password',
    },
  })

  const handleSubmit = async () => {
    if (form.validate()) {
      setLoading(true)
      const response: any = await signIn('credentials', {
        userId: form.values.email,
        password: form.values.password,
        callbackUrl: `${window.location.origin}/`,
        redirect: false,
      })
      if (response.ok) {
        setLoading(false)
        successNotification({})
        router.push('/')
      } else {
        setLoading(false)
        unsuccessfullNotification({ message: 'Credentials incorrect' })
      }
    }
  }

  return (
    <>
      <div tw="flex flex-col w-full px-4 py-5 justify-center mt-5">
        <Image
          alt="sign in icon"
          src="/img/singinicon.svg"
          width={206}
          height={203}
          tw="mx-auto"
        />

        <div tw="mt-8">
          <Text css={[style.text.md]} tw="w-full font-normal">
            Sign In
          </Text>
        </div>
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          action=""
          tw="py-1 flex flex-col relative "
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
          <TextInput
            required
            placeholder="Email"
            {...form.getInputProps('email')}
            size="xl"
            onBlur={() => form.validateField('email')}
            styles={{
              input: style.input.base,
              error: style.input.error,
            }}
          />

          <PasswordInput
            required
            placeholder="Password"
            variant="default"
            {...form.getInputProps('password')}
            onBlur={() => form.validateField('password')}
            size="xl"
            tw="mt-5"
            styles={{
              input: style.input.base,
              error: style.input.error,
            }}
          />
          <Text css={style.text.sm} tw="text-gray2 mt-5">
            Don’t have an account?{' '}
            <Link href={'/auth/register'} passHref>
              <span tw="text-primary ">Sign up</span>
            </Link>{' '}
          </Text>
          <Link href="/auth/forgot-password" passHref>
            <Text css={style.text.sm} tw="text-primary mt-3">
              Forgot password?
            </Text>
          </Link>

          <Button
            loading={loading}
            tw="bg-primary mt-32"
            size="lg"
            mt="xl"
            fullWidth
            type="submit"
          >
            Sign In
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

SignIn.auth = false
SignIn.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
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
    props: {},
  }
}
export default SignIn
