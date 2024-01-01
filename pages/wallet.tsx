import { ReactElement, useEffect, useState } from 'react'

import tw from 'twin.macro'

import Layout from '../layouts/layout'
import AppTab from '../layouts/home'
//import Back from '../layouts/back'

import Image from 'next/image'
import { Button, Text, Drawer, Input, ActionIcon } from '@mantine/core'

import { TiBackspace } from 'react-icons/ti'
import { AiOutlinePlus } from 'react-icons/ai'

//import { axios } from '../libs/axios'
import axios from 'axios'

import { activeHomeTabAtom } from '../stores'

import { useForm } from '@mantine/form'
import { NumericFormat } from 'react-number-format'

import LoadingScreen from '../components/LoadingScreen'
import SuccessMessage from '../components/SuccesMessage'
import AddBank from '../components/AddBank'
import WithdrawMenu from '../components/WithdrawMenu'

import { BiEditAlt } from 'react-icons/bi'

import { useMe } from '../hooks/api'

import banksPicturesApi from '../content/banks'

import { IBank } from '../types/index'

import { useAtom } from 'jotai'

import { useRouter } from 'next/router'
import { unsuccessfullNotification } from '../libs/notifications'
//let backMe: any

const Wallet = () => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('Wallet')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const { me, isLoading: meIsLoading } = useMe()

  const [success, setSuccess] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const [aDefault, setADefault] = useState(false)
  const [defaultBank, setDefaultBank] = useState<IBank | null>(null)

  const [showAddBank, setShowAddbank] = useState(false)
  const [showVerification, setShowVerification] = useState(false)

  const [shohWidthDrawMenu, setShowWithdrawMenu] = useState(false)

  const [bankData, setBankData] = useState<IBank | null>(null)

  const form = useForm({
    initialValues: {
      amount: 0,
    },
    validate: {
      amount: value => (value > -1 ? null : 'Please enter a value'),
    },
  })

  useEffect(() => {
    checkDefault(me?.accounts)
    Wallet.backMe = me?.balance
    //console.log('me ', me?.data.data)
  }, [me])

  const checkDefault = (accounts: []) => {
    if (accounts?.length > 0) {
      accounts.map((i: any) => {
        if (i.default) {
          setDefaultBank(i)
          setADefault(true)
          return
        }
      })
    }
  }

  const getImageUrl = (bank: IBank) => {
    const foundApi: any = banksPicturesApi.find((nBank: any) => {
      if (bank.bankId == nBank.code) {
        return true;
      }
    })
    if (foundApi) return foundApi?.logo
    return '/img/banks/default-image.png'
  }

  const handleSubmit = async () => {
    if (form.values.amount < 500) {
      unsuccessfullNotification({
        message: 'Amount should be greater than 500',
      })
      return
    }

    if (me?.balance < form.values.amount) {
      unsuccessfullNotification({ message: 'Insufficient balance' })
      return
    }
    setConfirm(true) //show comfirm
  }

  const onSubmit = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/request-withdraw', {
        amount: form.values.amount,
      })

      if (response?.status == 200) {
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

  if (meIsLoading) return <LoadingScreen />
  return (
    <>
      <Drawer
        opened={confirm}
        position="bottom"
        padding="xs"
        withCloseButton
        size={350}
        onClose={() => setConfirm(false)}
        tw="rounded-tr-xl rounded-tl-xl overflow-y-scroll"
      >
        <div tw="flex flex-col">
          <div tw="flex justify-between py-2">
            <p>Account Name:</p>
            <p tw="font-medium text-left capitalize">
              {defaultBank?.accountName?.toLocaleLowerCase()}
            </p>
          </div>

          <div tw="flex justify-between py-2">
            <p>Account Number:</p>
            <p tw="font-medium">{defaultBank?.accountNumber}</p>
          </div>

          <div tw="flex justify-between py-2">
            <p>Bank:</p>
            <p tw="font-medium">{defaultBank?.bank}</p>
          </div>

          <div tw="flex justify-between py-2">
            <p>Amount:</p>
            <p tw="font-medium">₦{form.values.amount}.00</p>
          </div>

          <div tw="flex items-center justify-between py-2">
            <p>Fee:</p>
            <p tw=" font-medium">₦40.00</p>
          </div>
        </div>
        <Button
          loading={loading}
          tw="bg-primary"
          size="lg"
          mt="xl"
          fullWidth
          type="submit"
          onClick={() => onSubmit()}
        >
          Confirm
        </Button>
      </Drawer>

      <Drawer
        tw="overflow-y-scroll"
        transition="pop"
        opened={showAddBank}
        withCloseButton={false}
        onClose={() => setShowAddbank(false)}
        size="full"
      >
        <>
          <div tw="flex w-full justify-between px-4 pt-5">
            <div tw="cursor-pointer">
              <Image
                src={'/img/back.svg'}
                width="24"
                height="24"
                alt="go back"
                onClick={() => setShowAddbank(false)}
              />
            </div>
          </div>
        </>
        <div tw=" w-full px-4 py-5">
          <AddBank
            mode={'profile'}
            setShow={setShowAddbank}
            setShowVerification={setShowVerification}
            bankDataSetter={setBankData}
          />
        </div>
      </Drawer>

      {/* Withdraw */}
      <Drawer
        tw="overflow-y-scroll"
        transition="pop"
        opened={shohWidthDrawMenu}
        withCloseButton={false}
        onClose={() => setShowWithdrawMenu(false)}
        size="full"
      >
        <>
          <div tw="flex w-full justify-between px-4 pt-2">
            <div tw="cursor-pointer">
              <Image
                src={'/img/back.svg'}
                width="24"
                height="24"
                alt="go back"
                onClick={() => setShowWithdrawMenu(false)}
              />
            </div>
          </div>
        </>
        <div tw=" w-full">
          <WithdrawMenu setShow={setShowWithdrawMenu} />
        </div>
      </Drawer>

      {success && (
        <SuccessMessage
          redirectTo="/transactions"
          title="Withdrawal Successful"
        />
      )}

      <div tw="flex w-full items-center  px-4">
        <div tw="flex items-baseline py-3">
          <Image
            src={'/img/back.svg'}
            width="24"
            height="24"
            onClick={() => router.back()}
            alt="back icon"
          />
        </div>

        <p tw="flex-1 text-black1 text-center text-lg font-medium py-3 pr-6">
          Available balance:{' '}
          <NumericFormat
            tw=""
            css={[tw`text-center`]}
            thousandsGroupStyle="thousand"
            value={me?.balance}
            prefix="₦"
            suffix=""
            decimalSeparator="."
            displayType="text"
            type="text"
            thousandSeparator={true}
            allowNegative={true}
          />
        </p>
      </div>
      <div tw="flex flex-col w-full justify-center px-4">
        {me?.accounts.length > 0 ? (
          <div tw="w-full flex flex-col">
            {defaultBank && defaultBank ? (
              <div tw="w-full flex flex-row px-2 bg-gray-100 rounded-lg justify-between space-y-2">
                <div tw="flex flex-row items-center ">
                  <Image
                    src={getImageUrl(defaultBank)}
                    width="42"
                    height="42"
                    alt="add bank"
                  />
                  <div tw="flex-1 p-2 flex-col">
                    <p tw="text-sm text-black1 font-semibold uppercase">
                      {defaultBank.accountName}
                    </p>
                    <p tw="text-sm text-black2">
                      {defaultBank.accountNumber} | {defaultBank.bank}{' '}
                    </p>
                  </div>
                </div>

                <div
                  tw="cursor-pointer text-primary"
                  onClick={() => setShowWithdrawMenu(true)}
                >
                  <ActionIcon radius="xl" tw="bg-transparent text-black2">
                    <BiEditAlt size="16" />
                  </ActionIcon>
                </div>
              </div>
            ) : (
              <div tw="mb-5 p-3 mx-4 bg-primaryblue4 rounded-md inline-flex items-center space-x-2">
                <div
                  tw="cursor-pointer text-primary"
                  onClick={() => setShowWithdrawMenu(true)}
                >
                  <ActionIcon radius="xl" tw="bg-deepblue text-white">
                    <BiEditAlt size="16" />
                  </ActionIcon>
                </div>
                <Text size="xs" color="black">
                  Set a default Bank Account
                </Text>
              </div>
            )}
          </div>
        ) : (
          <div tw="mb-5 p-3 mx-4 bg-primaryblue4 rounded-md inline-flex items-center space-x-2">
            <div
              tw="cursor-pointer text-primary"
              onClick={() => setShowAddbank(true)}
            >
              <ActionIcon radius="xl" tw="bg-deepblue text-white">
                <AiOutlinePlus size="16" />
              </ActionIcon>
            </div>

            <Text size="xs" color="black">
              Add a Bank Account
            </Text>
          </div>
        )}
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          action=""
          tw="flex flex-col relative pt-6"
        >
          <Input.Wrapper>
            <NumericFormat
              css={[
                tw`p-4 outline-none w-full flex justify-center [font-family:'Euclid Circular A'] font-normal [font-size:32px]`,
              ]}
              thousandsGroupStyle="thousand"
              onBlur={() => form.validateField('amount')}
              prefix="₦"
              contentEditable={false}
              decimalSeparator="."
              displayType="text"
              type="text"
              defaultValue={0}
              value={form.values.amount}
              thousandSeparator={true}
              onValueChange={values => {
                form.setFieldValue('amount', parseInt(values.value))
              }}
            />
          </Input.Wrapper>

          <div tw="grid grid-cols-3 place-items-center grid-rows-4 gap-3">
            <h3
              onClick={() =>
                form.setFieldValue('amount', parseInt(form.values.amount + '1'))
              }
              tw="text-xl font-medium text-black2 p-3"
            >
              1
            </h3>
            <h3
              onClick={() =>
                form.setFieldValue('amount', parseInt(form.values.amount + '2'))
              }
              tw="text-xl font-medium text-black2 p-3"
            >
              2
            </h3>
            <h3
              onClick={() =>
                form.setFieldValue('amount', parseInt(form.values.amount + '3'))
              }
              tw="text-xl font-medium text-black2 p-3"
            >
              3
            </h3>
            <h3
              onClick={() =>
                form.setFieldValue('amount', parseInt(form.values.amount + '4'))
              }
              tw="text-xl font-medium text-black2 p-3"
            >
              4
            </h3>
            <h3
              onClick={() =>
                form.setFieldValue('amount', parseInt(form.values.amount + '5'))
              }
              tw="text-xl font-medium text-black2 p-3"
            >
              5
            </h3>
            <h3
              onClick={() =>
                form.setFieldValue('amount', parseInt(form.values.amount + '6'))
              }
              tw="text-xl font-medium text-black2 p-3"
            >
              6
            </h3>
            <h3
              onClick={() =>
                form.setFieldValue('amount', parseInt(form.values.amount + '7'))
              }
              tw="text-xl font-medium text-black2 p-3"
            >
              7
            </h3>
            <h3
              onClick={() =>
                form.setFieldValue('amount', parseInt(form.values.amount + '8'))
              }
              tw="text-xl font-medium text-black2 p-3"
            >
              8
            </h3>
            <h3
              onClick={() =>
                form.setFieldValue('amount', parseInt(form.values.amount + '9'))
              }
              tw="text-xl font-medium text-black2 p-3"
            >
              9
            </h3>
            <h3
              onClick={() =>
                form.setFieldValue('amount', parseInt(form.values.amount + '0'))
              }
              tw="text-xl font-medium text-black2 p-3"
            >
              0
            </h3>
            <h3
              onClick={() =>
                form.setFieldValue(
                  'amount',
                  parseInt(form.values.amount + '00'),
                )
              }
              tw="text-xl font-medium text-black2 p-3"
            >
              00
            </h3>
            <TiBackspace
              color="gray"
              size="48"
              tw="text-xl font-medium text-black2 p-3"
              onClick={() => {
                const value = form.values.amount.toString()
                if (value.length == 1) {
                  form.setFieldValue('amount', 0)
                  return
                }
                form.setFieldValue('amount', parseInt(value.slice(0, -1)))
              }}
            />
          </div>
          <Button
            disabled={!aDefault}
            loading={loading}
            tw="bg-primary mt-12"
            size="lg"
            mt="md"
            fullWidth
            type="submit"
          >
            Withdraw
          </Button>
        </form>
      </div>

      <style global jsx>
        {`
          .scrollbar::-webkit-scrollbar {
            display: none;
          }
          .scrollbar {
            scrollbar-width: none;
          }
        `}
      </style>
    </>
  )
}

Wallet.auth = true
Wallet.backMe = 0
Wallet.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {/*  <Back /> */}
      <AppTab />
      <div tw="pb-4 w-full">{page}</div>
    </Layout>
  )
}

export default Wallet
