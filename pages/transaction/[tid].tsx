import { useRouter } from 'next/router'

import Image from 'next/image'
import tw from 'twin.macro'

import Style from '../../styles/Styles'

import dayjs from 'dayjs'

import { NumericFormat } from 'react-number-format'
import { useTranaction } from '../../hooks/api'
import LoadingScreen from '../../components/LoadingScreen'
import Layout from '../../layouts/layout'
import Back from '../../layouts/back'
import { ReactElement, useState } from 'react'
import AppTab from '../../layouts/home'
import { Input, Modal, Textarea } from '@mantine/core'
import LottieWrapper from '../../components/LottieAnimation'
import trxLottie from '../../public/lottie/trx.json';

export interface ITransactionProps {
  amount: number
  charge: number
  comments: string
  createdAt: string
  currency: string
  iconType: string
  iconUrl: string
  images: []
  narration: string
  status: string
  tradeId: null | string
  type: string
  updatedAt: string
  userId: string
  vendor: string
  _id: string
}

const Transaction = () => {
  const router = useRouter()
  const { tid } = router.query

  const [opened, setOpened] = useState(false)
  const [modalImage, setModalImage] = useState('')

  const { transaction, isLoading } = useTranaction(tid ?? '')

  if (isLoading) {
    return <LoadingScreen />
  }
  console.log(transaction);
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} centered>
        <Image src={modalImage} height="500" width="500" alt="trade image" />
      </Modal>

      <div tw="w-full flex items-center justify-between mt-5 mb-4">
        <p tw="text-black1 text-lg mx-auto font-normal">Transaction Details</p>
      </div>
      <div tw="flex flex-col justify-center mx-auto min-w-0 mt-3 px-5 pt-5 pb-3 bg-black6 rounded-lg">
        {/* <Image
          tw="mx-auto"
          src="/img/transactionicon.svg"
          width={108}
          height={112}
          alt="transaction icon"
        /> */}

        <LottieWrapper
          animationData={trxLottie}
        />

        <div tw=" flex justify-center mt-5">
          <p css={Style.text.md} tw="text-black1 w-9/12 ">
            {transaction?.narration}
          </p>
        </div>

        <div tw=" flex flex-col justify-center mt-5 divide-y-[1px] divide-black4">
          <div tw="flex justify-between items-center  py-2">
            <p css={Style.text.sm} tw="text-black2">
              Transaction ID:
            </p>
            <p css={Style.text.md} tw="font-medium [font-size:12px]">
              {transaction?._id}
            </p>
          </div>

          <div tw="flex justify-between items-center  py-2">
            <p css={Style.text.sm} tw="text-black2">
              Status:
            </p>
            <p css={Style.text.md} tw="font-medium capitalize text-sm">
              {transaction?.status}
            </p>
          </div>

          <div tw="flex justify-between items-baseline py-2">
            <p css={Style.text.sm} tw="text-black2">
              Date:
            </p>
            <p css={Style.text.sm} tw="font-medium">
              {dayjs(transaction?.createdAt).format('MMMM DD, YYYY H:m A')}
            </p>
          </div>

          {transaction?.rate && (
            <div tw="flex justify-between items-baseline py-2 ">
              <p css={Style.text.sm} tw="text-black2">
                Rate:
              </p>
              <p css={Style.text.sm} tw="font-medium">
                {transaction?.rate}
              </p>
            </div>
          )}

          {transaction?.metaData?.phone_number && (
            <div tw="flex justify-between items-baseline py-2 ">
              <p css={Style.text.sm} tw="text-black2">
                Phone Number:
              </p>
              <p css={Style.text.sm} tw="font-medium">
                {transaction?.metaData?.phone_number}
              </p>
            </div>
          )}

          <div tw="flex justify-between items-baseline py-2">
            <p css={Style.text.sm} tw="text-black2">
              Amount:
            </p>
            <NumericFormat
              css={[Style.text.smbold]}
              thousandsGroupStyle="thousand"
              value={transaction?.amount}
              prefix="₦"
              suffix=""
              decimalSeparator="."
              displayType="text"
              type="text"
              thousandSeparator={true}
              allowNegative={true}
            />
          </div>
          { transaction?.narration.toLowerCase().includes('withdraw') &&
          
            <div tw="flex justify-between items-baseline py-2">
              <p css={Style.text.sm} tw="text-black2">
                Fee:
              </p>
              <NumericFormat
                css={[Style.text.smbold]}
                thousandsGroupStyle="thousand"
                value={transaction?.fee ?? 40}
                prefix="₦"
                suffix=""
                decimalSeparator="."
                displayType="text"
                type="text"
                thousandSeparator={true}
                allowNegative={true}
              />
            </div>
          }
          {transaction?.accountName && (
            <div tw="flex justify-between items-baseline px-0 py-2">
              <p css={Style.text.sm} tw="text-black2 whitespace-nowrap">
                Account Name:
              </p>
              <p css={Style.text.sm} tw="font-medium capitalize text-end w-1/2">
                {(transaction?.accountName + '').toLocaleLowerCase()}
              </p>
            </div>
          )}

          {transaction?.accountNumber && (
            <div tw="flex justify-between items-baseline py-2">
              <p css={Style.text.sm} tw="text-black2">
                Account Number:
              </p>
              <p css={Style.text.sm} tw="font-medium capitalize">
                {transaction?.accountNumber}
              </p>
            </div>
          )}

          {transaction?.bank && (
            <div tw="flex justify-between items-baseline py-2">
              <p css={Style.text.sm} tw="text-black2 whitespace-nowrap">
                Bank:
              </p>
              <p css={Style.text.sm} tw="font-medium  w-1/2 text-end capitalize">
                {transaction?.bank}
              </p>
            </div>
          )}

          {transaction?.amountInUSD && (
            <div tw="flex justify-between items-baseline py-2">
              <p css={Style.text.sm} tw="text-black2">
                Amount in USD:
              </p>
              <NumericFormat
                css={[Style.text.sm, tw`font-medium`]}
                thousandsGroupStyle="thousand"
                value={parseFloat(transaction?.amountInUSD).toFixed(2)}
                prefix="$"
                decimalSeparator="."
                displayType="text"
                type="text"
                thousandSeparator={true}
                allowNegative={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* <Input.Wrapper size="md" label="Comments" tw="my-2">
        <Textarea
          value={
            transaction?.comments?.trim().length > 0
              ? transaction?.comments
              : 'No comments'
          }
          autosize
          contentEditable={false}
          minRows={2}
          maxRows={7}
          styles={{
            input: Style.input.base,
            error: Style.input.error,
          }}
        />
      </Input.Wrapper> */}

      {/* {transaction?.images.length > 0 ? (
        <>
          <p tw="w-full text-black2 text-sm mt-3 mb-2">Attachment</p>

          <div tw="grid grid-cols-2 gap-2">
            {transaction?.images.map((item: any, index: number) => (
              <div key={index} tw="relative cursor-pointer">
                <div tw=" items-center">
                  <Image
                    src={item}
                    width="155"
                    height="99"
                    alt=""
                    onClick={() => {
                      setOpened(true), setModalImage(item)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p tw="w-full text-black2 text-sm mt-5">No attachment</p>
      )} */}
    </>
  )
}

Transaction.auth = true
Transaction.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back />
      <AppTab />
      <div tw="px-4 py-3 w-full">{page}</div>
    </Layout>
  )
}
export default Transaction
