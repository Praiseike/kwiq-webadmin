import { useEffect, useState } from 'react'

import Image from 'next/image'

import tw from 'twin.macro'

import { Text, Drawer, ActionIcon } from '@mantine/core'
import {
  useNotifications,
  updateNotification,
  showNotification,
} from '@mantine/notifications'

import { useMe } from '../hooks/api'
import axios from 'axios'

import { HiArrowLeft } from 'react-icons/hi'
import { BsFillCheckSquareFill, BsCheck } from 'react-icons/bs'
import { AiOutlinePlus } from 'react-icons/ai'
import { MdDelete, MdError } from 'react-icons/md'

import AddBank from '../components/AddBank'
import SwipeToRevealActions from '../components/SwipeToRevealActions'
import VerifyEmailAndPassowrd from '../components/VerifyEmailAndPassowrd'

import { IBank } from '../types'
import banksPicturesApi from '../content/banks'

interface WithdrawMenu {
  setShow?: (state: boolean) => void
}

export default function WithdrawMenu({ setShow }: WithdrawMenu) {
  const notifications = useNotifications()

  const { me, isLoading: meIsLoading, mutate } = useMe()

  const [aDefault, setADefault] = useState(false)
  const [accounts, setAccounts] = useState<IBank[]>([])

  const [showAddBank, setShowAddbank] = useState(false)
  const [showVerification, setShowVerification] = useState(false)

  const [bankData, setBankData] = useState<IBank | null>(null)
  const [defaultBank, setDefaultBank] = useState<IBank | null>(null)

  const [otherAcounts, setOtherAccounts] = useState<IBank[]>([])

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

  const checkOthers = (accounts: []) => {
    if (accounts?.length > 0) {
      const others: any = accounts.filter((account: IBank) => !account.default)
      setOtherAccounts(others)
    }
  }
  const handleAddNewBank = async () => {
    mutate()
  }

  const handleDeleteBank = async (bank: IBank) => {
    showNotification({
      id: 'deleting',
      disallowClose: true,
      title: 'Deleting account',
      message: '',
      autoClose: false,
      loading: true,
      color: 'red',
      radius: 'md',
      style: tw`backdrop-blur-sm bg-red-400/60 `,
      styles: {
        root: {
          '::before': {
            backgroundColor: 'transparent',
          },
        },
        description: {
          color: 'black',
        },
      },
    })
    try {
      const response = await axios.delete(
        `/api/delete-bank-account/?account=${bank?.accountNumber}`,
      )
      if (response.status == 200) {
        handleAddNewBank()
        updateNotification({
          id: 'deleting',
          color: 'green',
          title: 'Account deleted',
          message: '',
          radius: 'md',
          style: tw`backdrop-blur-sm bg-green-400/60 `,
          icon: <BsCheck />,
          autoClose: 3000,
        })
      }
    } catch (e: any) {
      updateNotification({
        id: 'deleting',
        color: 'red',
        title: 'Error',
        message: 'Unknown error has occured',
        style: tw`backdrop-blur-sm bg-red-400/60 `,
        radius: 'md',
        icon: <MdError />,
        autoClose: 3000,
      })
    }
  }

  //When on initial load check a default
  useEffect(() => {
    setAccounts(me?.accounts)
    checkDefault(me?.accounts)
    checkOthers(me?.accounts)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me])

  useEffect(() => {
    console.log(bankData)
  }, [bankData])

  const getImageUrl = (bank: IBank) => {
    const foundApi: any = banksPicturesApi.find((nBank: any) => {
      if (bank.bankId == nBank.code) {
        return true
      }
    })
    if (foundApi) return foundApi?.logo
    return 'https://nigerianbanks.xyz/logo/default-image.png'
  }

  return (
    <>
      <Drawer
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
      <Drawer
        transition="pop"
        opened={showVerification}
        withCloseButton={false}
        onClose={() => setShowVerification(false)}
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
                onClick={() => setShowVerification(false)}
              />
            </div>
          </div>
        </>
        <div tw=" w-full px-4 py-5">
          <VerifyEmailAndPassowrd
            setShow={setShowVerification}
            setShowWithdraw={setShow}
            form={bankData}
            verifyType="addbank"
          />
        </div>
      </Drawer>
      <div tw="w-full  px-4 py-5">
        <p tw="w-full text-lg text-black1 [width:75%] font-medium ">
          Which Bank do you want to send money to?
        </p>
        <div tw="my-5 py-3 px-5 bg-primaryblue4 rounded-md inline-flex items-center space-x-2">
          <div tw="cursor-pointer text-primary">
            <ActionIcon
              onClick={() => setShowAddbank(true)}
              radius="xl"
              tw="bg-deepblue hover:bg-deepblue/80 text-white"
            >
              <AiOutlinePlus size="16" />
            </ActionIcon>
          </div>
          <Text size="xs" color="black">
            Add a New Bank Account
          </Text>
        </div>
        {defaultBank && defaultBank ? (
          <>
            <p tw="w-full text-sm text-black1 font-medium ">Default bank</p>
            <div tw="w-full space-y-2 mt-1">
              <div tw="flex flex-row items-center bg-white border-gray-300  border-[1px] rounded-lg px-2">
                <Image
                  src={getImageUrl(defaultBank)}
                  width="42"
                  height="42"
                  alt="add bank"
                />
                <div tw="flex-1 p-2 flex-col">
                  <p tw="text-sm text-gray1 font-semibold">
                    {defaultBank.accountName}
                  </p>
                  <p tw="text-sm text-black3">
                    {defaultBank.accountNumber} | {defaultBank.bank}{' '}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p tw="w-full text-sm text-black1 font-medium ">No default bank</p>
        )}
      </div>
      <div tw="w-full border-t-2">
        <div tw="px-4 py-6">
          {otherAcounts && otherAcounts.length > 0 ? (
            <>
              <p tw="w-full text-sm text-black1 font-bold ">Other banks</p>
              <div tw="inline-flex items-center mb-5">
                <p tw="w-full text-sm text-black1 font-medium ">
                  Swipe to see options
                </p>
                <HiArrowLeft size="24" />
              </div>
              <div tw="flex flex-col space-y-2">
                {otherAcounts.map((acount: IBank, index: number) => (
                  <SwipeToRevealActions
                    key={index}
                    height="62px"
                    hideDotsButton={true}
                    actionButtons={[
                      {
                        content: (
                          <div tw="bg-red-600  text-white h-[90%] flex flex-col items-center justify-center space-y-1">
                            <MdDelete size="24" />
                            <p>Delete</p>
                          </div>
                        ),
                        onClick: () => handleDeleteBank(acount),
                      },
                      {
                        content: (
                          <div tw="bg-blue-600  text-white h-[90%] flex flex-col items-center justify-center space-y-1">
                            <BsFillCheckSquareFill size="22" />
                            <p>Make Default</p>
                          </div>
                        ),
                        onClick: () => {
                          setBankData(acount)
                          setShowVerification(true)
                        },
                      },
                    ]}
                    actionButtonMinWidth={105}
                  >
                    <div tw="w-full space-y-2">
                      <div tw="flex flex-row items-center bg-white border-gray-300  border-[1px] rounded-lg px-2">
                        <Image
                          src={getImageUrl(acount)}
                          width="42"
                          height="42"
                          alt="add bank"
                        />
                        <div tw="flex-1 p-2 flex-col">
                          <p tw="text-sm text-gray1 font-semibold">
                            {acount.accountName}
                          </p>
                          <p tw="text-sm text-black3">
                            {acount.accountNumber} | {acount.bank}{' '}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwipeToRevealActions>
                ))}
              </div>
            </>
          ) : (
            <p tw="w-full text-sm text-black1 font-bold ">No other banks</p>
          )}
        </div>
      </div>
    </>
  )
}
