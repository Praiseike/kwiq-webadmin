/* eslint-disable react/display-name */

import React, { useEffect, useState } from 'react'

import { useForm } from '@mantine/form'
import {
  Button,
  TextInput,
  Alert,
  Select,
  Loader,
  Group,
  Input,
  Drawer,
} from '@mantine/core'
import { useNotifications } from '@mantine/notifications'

import { MdCheck, MdError } from 'react-icons/md'
import { FaChevronDown } from 'react-icons/fa'

import axios from 'axios'

import SuccessMessage from '../SuccesMessage'

import style from '../../styles/Styles'
import tw from 'twin.macro'
import { signOut } from 'next-auth/react'
import { unsuccessfullNotification } from '../../libs/notifications'

interface TvPaymentProps {
  provider: string
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string
  biller_code: string
  item_code: string
  label: string
}

const SelectItem = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ label, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <p tw="text-sm">{label}</p>
    </div>
  ),
)

// eslint-disable-next-line react/display-name
const TvPayment = ({ provider }: TvPaymentProps) => {
  const notifications = useNotifications()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [plans, setPlans] = useState([])
  const [confirmData, setConfirmData] = useState<any>({})
  const [value, setValue] = useState('')
  const [options, setOptions] = useState<any>([])
  const [confirm, setConfirm] = useState(false)
  const [amountLabel, setAmountLabel] = useState('Amount: 0')
  const controller = new AbortController()

  let cardLenght: number
  if (provider.toLowerCase() == 'dstv' || provider.toLowerCase() == 'gotv') {
    cardLenght = 10
  } else {
    cardLenght = 11
  }
  useEffect(() => {
    async function fetchProvider() {
      await axios
        .post(
          '/api/fetch-provider-tv-plan',
          {
            provider_name: provider.toUpperCase(),
          },
          { signal: controller.signal },
        )
        .then(res => setPlans(res.data.data.data))
        .catch(e => {
          if (e.response.status == 422) {
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
      item.value = index + '' //item['amount']+""
      item.label = item['plan_name']
      delete item.plan_name
      return item
    })

    setOptions(nPlan)
  }, [plans])

  const form = useForm({
    initialValues: {
      plan: '',
      card: '',
    },
    validate: {
      plan: value => (value.length > 0 ? null : 'Please choose a plan'),
      card: value =>
        value.length < 0
          ? 'Please type your card number'
          : value.length != cardLenght
          ? `Card number should be ${cardLenght} digit`
          : null,
    },
  })

  const handlePanChange = (e: any) => {
    setValue(e)
    form.setFieldValue('plan', e)
    setAmountLabel('Amount: ' + options[parseInt(e)]?.amount)
  }

  const handleSubmit = async () => {
    if (form.validate()) {
      setLoading(true)
      const data = options[parseInt(value)]
      try {
        const response = await axios.post('/api/validate-decoder-number', {
          decoderNumber: form.values.card,
          billerCode: data.biller_code,
          itemCode: data.item_code,
        })
        if (response.status == 200) {
          setConfirmData({
            ...data,
            name: response.data.data.data.name,
            plan: data.label,
            amount: data.amount,
          })
          setLoading(false)
          setConfirm(true)
        }
      } catch (error: any) {
        setLoading(false)
        unsuccessfullNotification({
          message: error?.response.data.data.message,
        })
      }
    }
  }
  const SubmitForm = async () => {
    if (confirm) {
      setLoading(true)
      try {
        const response = await axios.post('/api/buy-tv-subscription', {
          amount: confirmData?.amount,
          plan_name: confirmData?.label,
          card_number: form.values.card,
        })
        if (response.status == 200) {
          setLoading(false)
          setConfirm(false)
          setSuccess(true)
        }
      } catch (error: any) {
        setLoading(false)
        unsuccessfullNotification({
          message: error?.response.data.data.message,
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
            <p tw=" font-medium">{confirmData?.plan}</p>
          </div>

          <div tw="flex items-center justify-between py-4">
            <p>Card</p>
            <p tw=" font-medium">{form.values.card}</p>
          </div>

          <div tw="flex items-center justify-between py-4">
            <p>Card Name</p>
            <p tw=" font-medium">{confirmData?.name}</p>
          </div>
        </div>
        <hr tw="border-2" />
        <div tw="flex justify-between mt-4">
          <p>Total</p>
          <p tw="text-green-500 text-lg">₦{confirmData?.amount}</p>
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
      <p tw="w-full text-2xl font-medium ">
        Pay {provider.toUpperCase()} Bills
      </p>

      <form
        onSubmit={form.onSubmit(handleSubmit)}
        tw="py-2 flex flex-col space-y-5"
      >
        {options.length <= 1 ? (
          <Group position="center">
            <Loader />
          </Group>
        ) : (
          <Select
            placeholder="Select plan"
            itemComponent={SelectItem}
            data={options}
            {...form.getInputProps('plan')}
            onBlur={() => form.validateField('plan')}
            onChange={e => handlePanChange(e)}
            value={value}
            maxDropdownHeight={400}
            rightSection={<FaChevronDown />}
            size="xl"
            styles={{
              input: style.input.base,
              error: style.input.error,
              rightSection: { pointerEvents: 'none' },
            }}
            filter={(value, item) =>
              item?.plan_name
                ?.toLowerCase()
                .includes(value.toLowerCase().trim())
            }
          />
        )}

        <TextInput
          value={amountLabel}
          onChange={(e: any) => setAmountLabel(e)}
          size="xl"
          type="text"
          readOnly
          styles={{
            input: style.input.base,
            error: style.input.error,
          }}
        />
        <TextInput
          required
          placeholder="Card number"
          {...form.getInputProps('card')}
          onBlur={() => form.validateField('card')}
          size="xl"
          type="number"
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
          Confirm
        </Button>
      </form>
    </>
  )
}

TvPayment.displayName = 'TvPayment'
export default TvPayment
