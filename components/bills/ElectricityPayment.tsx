import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import tw from 'twin.macro'

import { useForm } from '@mantine/form'
import {
  Button,
  TextInput,
  Alert,
  Select,
  Input,
  Loader,
  Group,
  Drawer,
} from '@mantine/core'
import { useNotifications } from '@mantine/notifications'

import axios from 'axios'
import { MdCheck, MdError } from 'react-icons/md'
import { FaChevronDown } from 'react-icons/fa'

import NumberFormat, { NumericFormat } from 'react-number-format'
import SuccessMessage from '../SuccesMessage'
import { signOut } from 'next-auth/react'

import style from '../../styles/Styles'
import { unsuccessfullNotification } from '../../libs/notifications'

interface ElectricityPaymentProps {
  provider: string
}

export default function ElectricityPayment({
  provider,
}: ElectricityPaymentProps) {
  const notifications = useNotifications()

  const [plans, setPlans] = useState([])
  const [options, setOptions] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [value, setValue] = useState('')
  const [confirmData, setConfirmData] = useState<any>({})

  const controller = new AbortController()

  useEffect(() => {
    async function fetchProvider() {
      await axios
        .post(
          '/api/fetch-provider-electricity-plans',
          {
            provider_name: provider,
          },
          { signal: controller.signal },
        )
        .then(res => setPlans(res.data.data.data))
        .catch(e => {
          if (e?.response?.status == 422) {
            signOut()
          }
        })
    }
    fetchProvider()

    return () => {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const nPlan = plans?.map((item: any, index: number) => {
      item.value = index + ''
      item.label = item['plan_name']
      //item['value'] = item.plan_name
      delete item.plan_name
      return item
    })

    setOptions(nPlan)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans])

  const form = useForm({
    initialValues: {
      plan: '',
      meter: '',
      amount: '',
    },
    validate: {
      plan: value => (value.length > 0 ? null : 'Please choose a service'),
      meter: value => (value.length > 0 ? null : 'Please type a meter number'),
      amount: value => (value.length > 0 ? null : 'Please type an amount'),
    },
  })

  const handlePanChange = (e: any) => {
    setValue(e)
    form.setFieldValue('plan', e)
  }

  const SubmitForm = async () => {
    if (confirm) {
      setLoading(true)
      try {
        const response = await axios.post('/api/buy-electricity-bill', {
          amount: form.values.amount,
          plan_name: confirmData?.label,
          meter_number: form.values.meter,
        })
        if (response.status == 200) {
          setLoading(false)
          setSuccess(true)
          setConfirm(false)
        }
      } catch (error: any) {
        setLoading(false)
        unsuccessfullNotification({
          message: error?.response.data.data.message,
        })
      }
    }
  }

  const handleSubmit = async () => {
    if (form.validate()) {
      setLoading(true)
      const data = options[parseInt(value)]
      try {
        const response = await axios.post('/api/validate-meter-number', {
          meterNumber: form.values.meter,
          billerCode: data.biller_code,
          itemCode: data.item_code,
        })

        if (response.status == 200) {
          setConfirmData({
            ...data,
            name: response.data.data.data.name,
          })

          const amount = parseInt(form.values.amount)
          if (
            amount < response.data.data.data.minimum ||
            amount > response.data.data.data.maximum
          ) {
            unsuccessfullNotification({
              message:
                'The amount to recharge can not be greater than ₦500 or less than ₦50,000`',
            })

            setLoading(false)
            return
          }
          setLoading(false)
          setConfirm(true)
        }
      } catch (error: any) {
        setLoading(false)
        unsuccessfullNotification({
          message: error?.response?.data?.data?.message,
        })
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
        size={470}
        onClose={() => setConfirm(false)}
        tw="rounded-tr-xl rounded-tl-xl"
      >
        <p style={style.text.md}>Please confirm</p>
        <div tw="flex flex-col divide-y-2 mt-2">
          <div tw="flex justify-between py-4">
            <p>Provider</p>
            <p tw="font-medium">{provider.toUpperCase()}</p>
          </div>

          <div tw="flex items-center justify-between py-4">
            <p>Plan</p>
            <p tw=" font-medium">{confirmData?.label}</p>
          </div>

          <div tw="flex items-center justify-between py-4">
            <p>Meter Number</p>
            <p tw=" font-medium">{form.values.meter}</p>
          </div>

          <div tw="flex items-center justify-between py-4">
            <p>Meter Name</p>
            <p tw=" font-medium">{confirmData?.name}</p>
          </div>
        </div>
        <hr tw="border-2" />
        <div tw="flex justify-between mt-4">
          <p>Total</p>
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

      <p tw="w-full text-2xl font-medium ">Pay Electricity Bills</p>

      {success && <SuccessMessage title="Electicity bill purchase succesful" />}

      <div tw="my-2 p-2 bg-[#279aed] rounded-lg items-center flex space-x-2">
        <Image
          src={`/img/bills/${provider.toLowerCase()}.png`}
          height={40}
          width={45}
          alt=""
        />
        <p tw="text-white">{provider}</p>
      </div>

      <form onSubmit={form.onSubmit(handleSubmit)} tw="flex flex-col space-y-5">
        {options.length <= 1 ? (
          <Group position="center">
            <Loader />
          </Group>
        ) : (
          <Select
            tw=""
            placeholder="Select meter type"
            size="xl"
            {...form.getInputProps('plan')}
            onBlur={() => form.validateField('plan')}
            onChange={e => handlePanChange(e)}
            value={value}
            rightSection={<FaChevronDown />}
            styles={{
              input: style.input.base,
              error: style.input.error,
              rightSection: { pointerEvents: 'none' },
            }}
            data={options}
          />
        )}

        <TextInput
          required
          type="number"
          placeholder="Meter Number"
          {...form.getInputProps('meter')}
          size="xl"
          onBlur={() => form.validateField('meter')}
          styles={{
            input: style.input.bold,
            error: style.input.error,
          }}
        />

        <Input.Wrapper error={form.errors.amount}>
          <NumericFormat
            css={[style.input.base, tw`p-4 outline-none font-normal w-full`]}
            thousandsGroupStyle="thousand"
            onBlur={() => form.validateField('amount')}
            placeholder="Amount"
            prefix="₦"
            suffix=".00"
            decimalSeparator="."
            displayType="input"
            type="text"
            thousandSeparator={true}
            onValueChange={values => {
              form.setFieldValue('amount', values.value)
            }}
          />
        </Input.Wrapper>

        <Button
          loading={loading}
          tw="bg-primary"
          size="lg"
          mt="xl"
          fullWidth
          type="submit"
        >
          Confirm
        </Button>
      </form>
    </>
  )
}
