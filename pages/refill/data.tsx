import { useState, useEffect } from 'react'
import tw from 'twin.macro'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import { signOut } from 'next-auth/react'

import { useForm } from '@mantine/form'
import { Button, TextInput, Select, Loader, Group, Drawer } from '@mantine/core'

import 'react-phone-number-input/style.css'

import style from '../../styles/Styles'
import { FaChevronDown } from 'react-icons/fa'

import { unsuccessfullNotification } from '../../libs/notifications'

import SuccessMessage from '../../components/SuccesMessage'
import Layout from '../../layouts/layout'
import Back from '../../layouts/back'
import AppTab from '../../layouts/home'

import { activeHomeTabAtom } from '../../stores'
import { useAtom } from 'jotai'
import axios from 'axios'

interface AirtimeProps { }

//The component at which a user is actually created
const Data = ({ }: AirtimeProps) => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('Transactions')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const searchParams = useSearchParams()
  const network = searchParams.get('network')

  const [loading, setLoading] = useState(false)

  const [plans, setPlans] = useState([])
  const [options, setOptions] = useState<any>([])
  const [confirm, setConfirm] = useState(false)
  const [success, setSuccess] = useState(false)
  const [confirmData, setConfirmData] = useState<any>({})
  const [value, setValue] = useState('')
  const [amountLabel, setAmountLabel] = useState('Amount: 0')

  useEffect(() => {
    const controller = new AbortController()
    async function fetchProvider() {
      await axios
        .post(
          '/api/fetch-provider-data-plans',
          {
            provider_name: network?.toUpperCase(),
          },
          { signal: controller.signal },
        )
        .then(res => {
          return setPlans(res.data.data.data)
        })
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
      item.value = index + '' //item['amount']+""
      item.label = item['data_plan']
      delete item.data_plan
      return item
    })

    setOptions(nPlan)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans])

  const form = useForm({
    initialValues: {
      data: '',
      phone: '',
    },
    validate: {
      data: value => (value.length > 0 ? null : 'Please choose a data plan'),
      phone: value =>
        value.length == 11 ? null : 'Please enter a valid number',
    },
  })

  const handleDataChange = (e: any) => {
    setValue(e)
    form.setFieldValue('data', e)
    setAmountLabel('Amount: ' + options[parseInt(e)]?.amount)
  }

  const handleSubmit = async () => {
    if (form.validate()) {
      setLoading(true)
      const data = options[parseInt(value)]
      try {
        const response = await axios.post('/api/validate-phone-number', {
          phoneNumber: form.values.phone,
        })
        if (response.status == 200) {
          setConfirmData(data)
          setLoading(false)
          setConfirm(true)
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
        const response = await axios.post('/api/buy-data-bundle', {
          amount: confirmData?.amount,
          data_plan: confirmData?.label,
          phone_number: form.values.phone,
        })
        if (response.status == 200) {
          setLoading(false)
          setConfirm(false)
          setSuccess(true)
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
        size={410}
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
            <p tw="font-medium">{network}</p>
          </div>

          <div tw="flex justify-between py-4">
            <p>Plan</p>
            <p tw="font-medium">{confirmData?.label}</p>
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
      <p tw="w-full text-2xl font-semibold">Buy Data</p>

      <div tw="mb-2 mt-8 p-2 bg-[#279aed] rounded-lg items-center flex space-x-2">
        <Image
          tw="p-0.5 bg-white rounded-full"
          src={`/img/bills/${network}.png`}
          height={40}
          width={45}
          alt=""
        />
        <p tw="text-white capitalize">{network}</p>
      </div>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        tw="py-5 flex flex-col space-y-5"
      >
        {options.length <= 1 ? (
          <Group position="center">
            <Loader />
          </Group>
        ) : (
          <Select
            tw=""
            placeholder="Select a data plan"
            size="xl"
            rightSection={<FaChevronDown />}
            maxDropdownHeight={400}
            {...form.getInputProps('data')}
            onBlur={() => form.validateField('data')}
            onChange={e => handleDataChange(e)}
            value={value}
            styles={{
              input: style.input.base,
              error: style.input.error,
              rightSection: { pointerEvents: 'none' },
              item: tw`text-sm`,
            }}
            data={options}
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
          Comfirm
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

Data.auth = true
Data.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      <Back />
      <AppTab />
      <div tw="px-4 py-5 w-full">{page}</div>
    </Layout>
  )
}

export default Data
