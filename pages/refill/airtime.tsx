import React, { ReactElement, useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import Image from 'next/image'
import { useForm } from '@mantine/form'
import { Button, Input, TextInput, Drawer } from '@mantine/core'

import { unsuccessfullNotification } from '../../libs/notifications'

import style from '../../styles/Styles'

import axios from 'axios'
import tw from 'twin.macro'

import 'react-phone-number-input/style.css'

import { NumericFormat } from 'react-number-format'
import SuccessMessage from '../../components/SuccesMessage'
import Layout from '../../layouts/layout'
import AppTab from '../../layouts/home'
import Back from '../../layouts/back'
import { activeHomeTabAtom } from '../../stores'
import { useAtom } from 'jotai'

interface AirtimeProps {
  network: string
}

const Airtime = ({ }: AirtimeProps) => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('Transactions')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const searchParams = useSearchParams()
  const network = searchParams.get('network')

  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [success, setSuccess] = useState(false)

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      amount: '',
      phone: '',
    },
    validate: {
      amount: value =>
        value.length < 0
          ? 'Please choose an amount'
          : parseInt(value) < 50
            ? 'Mininum amount to reacharge is 50 naira'
            : null,
      phone: value =>
        value.length == 11 ? null : 'Please enter a valid number',
    },
  })
  const handleSubmit = async () => {
    setLoading(true)
    if (form.validate()) {
      try {
        const response = await axios.post('/api/validate-phone-number', {
          phoneNumber: form.values.phone,
        })
        if (response.status == 200) {
          setLoading(false)
          setConfirm(true)
          // setMessage({ message: response?.data.message, type: "message" })
        }
      } catch (error: any) {
        setLoading(false)
        unsuccessfullNotification({ message: error?.response.data.data.message })
      }
    }
  }

  const SubmitForm = async () => {
    if (confirm) {
      setLoading(true)
      try {
        const response = await axios.post('/api/buy-airtime', {
          amount: form.values.amount,
          phone_number: form.values.phone,
          network: network,
        })
        if (response.status == 200) {
          setLoading(false)
          setSuccess(true)
          setConfirm(false)
        }
      } catch (error: any) {
        setLoading(false)
        unsuccessfullNotification({ message: error?.response.data.data.message })
      }
    }
  }

  return (
    <>
      <Drawer
        opened={confirm}
        position="bottom"
        padding="xs"
        withCloseButton
        size={350}
        onClose={() => setConfirm(false)}
        tw="rounded-tr-xl rounded-tl-xl"
      >
        <p style={style.text.md}>Please confirm</p>
        <div tw="flex flex-col divide-y-2 mt-2">
          <div tw="flex items-center justify-between py-4">
            <p>Phone Number</p>
            <p tw=" font-medium">{form.values.phone}</p>
          </div>

          <div tw="flex justify-between py-4">
            <p>Network</p>
            <p tw="font-medium">{network?.toLocaleUpperCase()}</p>
          </div>
        </div>
        <hr tw="border-2" />
        <div tw="flex justify-between mt-4">
          <p>Total Payment</p>
          <p tw="text-green-500 text-lg">₦{form.values.amount}</p>
        </div>
        <Button
          loading={loading}
          onClick={async () => await SubmitForm()}
          tw="bg-primary"
          size="lg"
          mt="xl"
          fullWidth
          type="submit"
        >
          Confirm
        </Button>
      </Drawer>
      {success && <SuccessMessage title="Transaction succesful" />}
      <p tw="w-full text-2xl font-semibold ">Buy Airtime</p>

      <div tw="my-2 mt-8 p-2 bg-[#279aed] rounded-lg items-center flex space-x-2">
        <Image
          tw="p-0.5 bg-white rounded-full"
          src={`/img/bills/${network?.toLowerCase()}.png`}
          height={45}
          width={45}
          alt=""
        />
        <p tw="text-white capitalize">{network}</p>
      </div>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        tw="py-5 flex flex-col space-y-5"
      >
        <Input.Wrapper error={form.errors.amount}>
          <NumericFormat
            css={[
              style.input.base,
              tw`p-4 h-[60px] outline-none font-normal w-full`,
            ]}
            thousandsGroupStyle="thousand"
            onBlur={() => form.validateField('amount')}
            placeholder="Amount"
            prefix="₦"
            displayType="input"
            type="tel"
            thousandSeparator={true}
            onValueChange={(values: any) => {
              form.setFieldValue('amount', values.value)
            }}
            pattern="^₦[-,0-9]+$"
          />
        </Input.Wrapper>

        <TextInput
          required
          inputMode='numeric'
          placeholder="Phone number"
          {...form.getInputProps('phone')}
          onBlur={() => form.validateField('phone')}
          size="xl"
          type="number"
          styles={{
            input: style.input.base,
            error: style.input.error,
          }}
        />
        <Button
          loading={loading}
          disabled={!form.isValid()}
          tw="bg-primary"
          size="lg"
          mt="xl"
          fullWidth
          type="submit"
        >
          Confirm
        </Button>
      </form>

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

Airtime.auth = true
Airtime.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back />
      <AppTab />
      <div tw="px-4 py-5 w-full">{page}</div>
    </Layout>
  )
}

export default Airtime
