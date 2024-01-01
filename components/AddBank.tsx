import Image from 'next/image'

import tw from 'twin.macro'
import style from '../styles/Styles'

import {
  Button,
  TextInput,
  Checkbox,
  Text,
  Select,
  Loader,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useForm } from '@mantine/form'

import { FaChevronDown } from 'react-icons/fa'
import useSWR from 'swr'
import { mutate } from 'swr'

import axios from 'axios'

import { signIn } from 'next-auth/react'

import { useEffect, useState } from 'react'

import router from 'next/router'
import {
  successNotification,
  unsuccessfullNotification,
} from '../libs/notifications'
export interface AddBankProps {
  form?: any
  mode: 'register' | 'profile'
  bankDataSetter?: React.Dispatch<React.SetStateAction<any>> //used when creating an account
  setShow?: React.Dispatch<React.SetStateAction<boolean>>
  setShowVerification?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AddBank({
  form: registerForm,
  mode,
  bankDataSetter,
  setShow,
  setShowVerification,
}: AddBankProps) {
  const [banks, setBanks] = useState([])
  const { data, error: err } = useSWR('banks', () =>
    axios.get('/api/banks').then(res => res.data),
  )

  useEffect(() => {
    const temp = data?.data?.data?.map((item: any, index: number) => ({
      ['label']: item.name,
      ['value']: item.code,
    }))

    setBanks(temp)
  }, [data])

  const form = useForm({
    initialValues: {
      bank: '',
      account: '',
      makedefault: false,
    },

    validate: {
      bank: value =>
        value?.trim()?.length > 0 ? null : 'Please select a bank',
      account: value =>
        value?.trim()?.length == 10
          ? null
          : 'Account number should be at least 10 digit number',
    },
  })

  const [debounced] = useDebouncedValue(form.values.account, 300)
  const [init, setInit] = useState(false)
  const [bankName, setBankName] = useState<string | null>('')
  const [loading, setLoading] = useState(false)
  const [isLoadingName, setIsLoadingName] = useState(false)
  const [haveBank, setHaveBank] = useState(true)

  const handleSubmit = async () => {
    //bank is is the code   form.values.bank
    //account is the account number debounced| form.values.account
    //bankName bankName
    //if type is register just go add or just create a new component to handle its own?
    const bankIds: any = banks.find(
      (bank: any) => bank.value == form.values.bank,
    )

    // if at registering
    if (form.validate()) {
      if (mode == 'register') {
        try {
          const response = await axios.post('/api/add-bank', {
            accountName: bankName,
            accountNumber: form.values.account,
            bank: bankIds?.label,
            bankId: bankIds?.value,
            default: form.values.makedefault, // at register you can set at default no security measures here
          })
          if (response.status == 200) {
            successNotification({ message: 'Registration Succesful' })
            router.push('/')
          }
        } catch (e: any) {
          // console.log(e.response.data.data.message)
        }
      }

      // if at profile set the data up the stack
      if (mode == 'profile') {
        try {
          //due to how the api was design you have to add account before actually verifying
          const response = await axios.post('/api/add-bank', {
            accountName: bankName,
            accountNumber: form.values.account,
            bank: bankIds?.label,
            bankId: bankIds?.value,
            //"default": form.values.makedefault // at register you can set at default no security measures here
          })
          if (response.status == 200) {
            //
            bankDataSetter?.({
              accountName: bankName,
              accountNumber: form.values.account,
              bank: bankIds?.label,
              bankId: bankIds?.value,
              default: form.values.makedefault,
            })
            setShow?.(false)
            if (form.values.makedefault) {
              setShowVerification?.(true)
            } else {
              mutate('/api/me')
              successNotification({ message: 'Account added succesfully' })
            }
          }
        } catch (e: any) {
          unsuccessfullNotification({message: e.response.data.data.message})
        }
      }
    }
  }

  const signInx = async (redirect: boolean) => {
    try {
      setLoading(true)
      await signIn('credentials', {
        userId: registerForm.email,
        password: registerForm.password,
        callbackUrl: `${window.location.origin}/`,
        redirect: redirect, //no redirect as we still want to add an account
      })
    } catch (e) {
      //console.log(e)
      setLoading(false)
    }
  }

  useEffect(() => {
    // to contol not to initially set errors
    if (init && form.values.bank.length < 1) {
      form.validateField('bank')
    } else {
      if (!init) setInit(true)
      //here we then make a call to get the acount name
      //if equals to ten then get the name
      if (form.values.account.length == 10) {
        setIsLoadingName(true)
        getBankName()
      } else {
        setBankName('')
        setIsLoadingName(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  const getBankName = async () => {
    try {
      const response = await axios.post('/api/get-bank-account-name', {
        account_number: debounced,
        account_bank: form.values.bank,
      })
      if (response.status == 200) {
        setIsLoadingName(false)
        setBankName(response.data?.data?.data)
        setHaveBank(false)
      }
    } catch (e: any) {
      setIsLoadingName(false)
      setBankName('Bank not found')
      setHaveBank(true)
    }
  }
  return (
    <>
      <div
        tw="w-full flex items-center justify-center  max-h-screen fixed inset-0 z-50 bg-white"
        css={[loading && tw`flex`, !loading && tw`hidden`]}
      >
        <div tw="flex flex-col justify-center items-center space-y-3 text-sm">
          <svg
            width="96"
            height="105"
            viewBox="0 0 96 105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M80.45 0H15.55C6.96196 0 0 7.03578 0 15.7149V89.2851C0 97.9642 6.96196 105 15.55 105H80.45C89.038 105 96 97.9642 96 89.2851V15.7149C96 7.03578 89.038 0 80.45 0Z"
              fill="white"
            />
          </svg>

          <svg
            width="147"
            height="30"
            viewBox="0 0 147 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.046 23L4.80601 13.34V23H0.486013V1.7H4.80601V10.73L12.486 1.7H17.856L9.09601 11.93L19.686 23H14.046ZM22.6661 5.54C21.9661 5.54 21.3561 5.29 20.8361 4.79C20.3161 4.27 20.0561 3.65 20.0561 2.93C20.0561 2.21 20.3161 1.6 20.8361 1.1C21.3561 0.579999 21.9661 0.319999 22.6661 0.319999C23.4061 0.319999 24.0261 0.579999 24.5261 1.1C25.0461 1.6 25.3061 2.21 25.3061 2.93C25.3061 3.65 25.0461 4.27 24.5261 4.79C24.0261 5.29 23.4061 5.54 22.6661 5.54ZM20.6261 23V8H24.7361V23H20.6261ZM28.3827 23V8H32.4927V9.71C33.4127 8.35 34.8427 7.67 36.7827 7.67C38.5827 7.67 39.9927 8.27 41.0127 9.47C42.0527 10.65 42.5727 12.23 42.5727 14.21V23H38.4627V14.9C38.4627 13.8 38.2327 12.95 37.7727 12.35C37.3127 11.73 36.6627 11.42 35.8227 11.42C34.8227 11.42 34.0127 11.78 33.3927 12.5C32.7927 13.22 32.4927 14.28 32.4927 15.68V23H28.3827ZM53.0317 29.57C50.9517 29.57 49.2517 29.04 47.9317 27.98C46.6117 26.92 45.8717 25.57 45.7117 23.93H49.7317C50.2517 25.41 51.3817 26.15 53.1217 26.15C54.0817 26.15 54.8817 25.84 55.5217 25.22C56.1817 24.6 56.5117 23.73 56.5117 22.61V20.84C56.0917 21.42 55.4917 21.9 54.7117 22.28C53.9317 22.64 53.0817 22.82 52.1617 22.82C50.2017 22.82 48.5317 22.09 47.1517 20.63C45.7717 19.15 45.0817 17.36 45.0817 15.26C45.0817 13.14 45.7717 11.35 47.1517 9.89C48.5317 8.41 50.2017 7.67 52.1617 7.67C53.1017 7.67 53.9517 7.86 54.7117 8.24C55.4917 8.6 56.0917 9.08 56.5117 9.68V8H60.6217V22.07C60.6217 24.61 59.8917 26.49 58.4317 27.71C56.9917 28.95 55.1917 29.57 53.0317 29.57ZM50.3317 18.02C51.0717 18.74 51.9717 19.1 53.0317 19.1C54.0917 19.1 54.9917 18.74 55.7317 18.02C56.4717 17.3 56.8417 16.38 56.8417 15.26C56.8417 14.14 56.4717 13.22 55.7317 12.5C54.9917 11.78 54.0917 11.42 53.0317 11.42C51.9717 11.42 51.0717 11.78 50.3317 12.5C49.5917 13.22 49.2217 14.14 49.2217 15.26C49.2217 16.38 49.5917 17.3 50.3317 18.02ZM74.6066 23.36C71.4066 23.36 68.7466 22.3 66.6266 20.18C64.5066 18.06 63.4466 15.45 63.4466 12.35C63.4466 9.25 64.5066 6.64 66.6266 4.52C68.7466 2.4 71.4066 1.34 74.6066 1.34C77.0266 1.34 79.1966 2.05 81.1166 3.47C83.0566 4.87 84.3266 6.7 84.9266 8.96H80.2166C79.7966 7.92 79.0566 7.09 77.9966 6.47C76.9566 5.85 75.8266 5.54 74.6066 5.54C72.6066 5.54 70.9766 6.19 69.7166 7.49C68.4566 8.79 67.8266 10.41 67.8266 12.35C67.8266 14.29 68.4566 15.91 69.7166 17.21C70.9766 18.51 72.6066 19.16 74.6066 19.16C75.8266 19.16 76.9566 18.85 77.9966 18.23C79.0566 17.61 79.7966 16.78 80.2166 15.74H84.9266C84.3266 18 83.0566 19.84 81.1166 21.26C79.1966 22.66 77.0266 23.36 74.6066 23.36ZM93.4848 23.33C91.5048 23.33 89.8348 22.56 88.4748 21.02C87.1148 19.48 86.4348 17.64 86.4348 15.5C86.4348 13.36 87.1148 11.52 88.4748 9.98C89.8348 8.44 91.5048 7.67 93.4848 7.67C94.4448 7.67 95.3048 7.87 96.0648 8.27C96.8248 8.67 97.4048 9.14 97.8048 9.68V8H101.915V23H97.8048V21.32C97.4048 21.86 96.8248 22.33 96.0648 22.73C95.3048 23.13 94.4448 23.33 93.4848 23.33ZM91.5948 18.44C92.2948 19.2 93.2148 19.58 94.3548 19.58C95.4948 19.58 96.4048 19.2 97.0848 18.44C97.7848 17.68 98.1348 16.7 98.1348 15.5C98.1348 14.3 97.7848 13.32 97.0848 12.56C96.4048 11.8 95.4948 11.42 94.3548 11.42C93.2148 11.42 92.2948 11.8 91.5948 12.56C90.9148 13.32 90.5748 14.3 90.5748 15.5C90.5748 16.7 90.9148 17.68 91.5948 18.44ZM105.61 23V8H109.72V10.4C109.98 9.66 110.45 9.05 111.13 8.57C111.83 8.07 112.6 7.82 113.44 7.82C113.96 7.82 114.42 7.88 114.82 8V12.17C114.16 11.95 113.54 11.84 112.96 11.84C111.98 11.84 111.19 12.2 110.59 12.92C110.01 13.62 109.72 14.59 109.72 15.83V23H105.61ZM122.709 23.33C120.729 23.33 119.059 22.56 117.699 21.02C116.339 19.48 115.659 17.64 115.659 15.5C115.659 13.36 116.339 11.52 117.699 9.98C119.059 8.44 120.729 7.67 122.709 7.67C123.669 7.67 124.529 7.87 125.289 8.27C126.049 8.67 126.629 9.14 127.029 9.68V0.499998H131.139V23H127.029V21.32C126.629 21.86 126.049 22.33 125.289 22.73C124.529 23.13 123.669 23.33 122.709 23.33ZM120.819 18.44C121.519 19.2 122.439 19.58 123.579 19.58C124.719 19.58 125.629 19.2 126.309 18.44C127.009 17.68 127.359 16.7 127.359 15.5C127.359 14.3 127.009 13.32 126.309 12.56C125.629 11.8 124.719 11.42 123.579 11.42C122.439 11.42 121.519 11.8 120.819 12.56C120.139 13.32 119.799 14.3 119.799 15.5C119.799 16.7 120.139 17.68 120.819 18.44ZM140.625 23.33C138.705 23.33 137.115 22.85 135.855 21.89C134.595 20.93 133.925 19.71 133.845 18.23H138.135C138.215 18.87 138.495 19.36 138.975 19.7C139.455 20.02 140.045 20.18 140.745 20.18C142.045 20.18 142.695 19.78 142.695 18.98C142.695 18.58 142.545 18.28 142.245 18.08C141.965 17.86 141.485 17.66 140.805 17.48L137.985 16.76C136.705 16.42 135.745 15.85 135.105 15.05C134.485 14.23 134.175 13.25 134.175 12.11C134.175 10.81 134.715 9.75 135.795 8.93C136.895 8.09 138.365 7.67 140.205 7.67C141.885 7.67 143.285 8.1 144.405 8.96C145.525 9.8 146.145 10.95 146.265 12.41H142.125C141.945 11.39 141.285 10.88 140.145 10.88C139.605 10.88 139.175 10.98 138.855 11.18C138.535 11.38 138.375 11.66 138.375 12.02C138.375 12.68 138.945 13.14 140.085 13.4L142.725 14.12C144.185 14.48 145.245 15.05 145.905 15.83C146.565 16.59 146.895 17.57 146.895 18.77C146.895 20.15 146.305 21.26 145.125 22.1C143.965 22.92 142.465 23.33 140.625 23.33Z"
              fill="#1585D7"
            />
          </svg>
          <Loader />
          {mode == 'register' && (
            <Text tw="text-black">Creating your account</Text>
          )}
          {mode == 'profile' && (
            <Text tw="text-black">Adding your account</Text>
          )}
        </div>
      </div>
      <div tw="flex justify-center">
        <Image
          src="/img/addbank.svg"
          width={132}
          height={156}
          alt="add bank icon"
        />
      </div>
      <div tw="mt-5">
        <Text css={[style.text.md]} tw="w-full">
          Add a bank account
        </Text>
        <Text css={[style.text.color.gray, style.text.sm]}>
          Please provide your bank account details
        </Text>
      </div>
      {banks ? (
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          action=""
          tw="py-5 flex flex-col space-y-5"
        >
          <div tw="mt-8">
            <Select
              placeholder="Select bank"
              searchable
              clearable
              required
              size="xl"
              maxDropdownHeight={300}
              {...form.getInputProps('bank')}
              data={banks}
              onBlur={() => form.validateField('bank')}
              rightSection={<FaChevronDown />}
              styles={{
                input: tw`rounded-xl bg-gray-100  text-sm`,
                error: tw`text-sm`,
                rightSection: { pointerEvents: 'none' },
                item: tw`text-sm`,
              }}
            />
          </div>
          <div tw=" relative ">
            <TextInput
              required
              type="number"
              tw="relative"
              placeholder="Account number"
              {...form.getInputProps('account')}
              size="xl"
              onBlur={() => form.validateField('account')}
              rightSection={isLoadingName && <Loader size="sm" />}
              styles={{
                input: style.input.base,
                error: style.input.error,
              }}
            />

            {!isLoadingName && (
              <span tw="text-primary font-normal px-4 text-xs uppercase absolute top-[15px] right-[0px]">
                {bankName}
              </span>
            )}
          </div>

          <Checkbox
            mt="md"
            label="Make this your default account"
            {...form.getInputProps('makedefault', { type: 'checkbox' })}
          />
          <div>
            {mode == 'register' && (
              <Button
                onClick={() => signInx(true)}
                css={[style.btn.transparent]}
                radius="md"
                size="xl"
                fullWidth
                type="button"
              >
                Skip
              </Button>
            )}
            <Button
              disabled={haveBank}
              loading={isLoadingName}
              tw="bg-primary mt-2 mb-9"
              size="xl"
              fullWidth
              type="submit"
            >
              Add bank account
            </Button>
          </div>
        </form>
      ) : (
        <div tw="w-full flex justify-center p-4">
          <Loader />
        </div>
      )}
    </>
  )
}
