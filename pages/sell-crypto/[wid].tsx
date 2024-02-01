import React, { ReactElement, useEffect, useRef, useState } from 'react'

import tw from 'twin.macro'

import Layout from '../../layouts/layout'
import AppTab from '../../layouts/home'

import { useRouter } from 'next/router'

import Image from 'next/image'

import { Button, Group } from '@mantine/core'

import { useAtom } from 'jotai'
import { activeHomeTabAtom } from '../../stores'

import axios from 'axios'

import { FaCoins, FaDollarSign } from 'react-icons/fa'
import copy from 'copy-to-clipboard'
//import

import QRCode from 'react-qr-code'

import useSWR, { mutate } from 'swr'
import { useMe } from '../../hooks/api'

import { AiFillBank } from 'react-icons/ai'
import { IoMdAlert } from 'react-icons/io'
import { exportAsImage } from '../../utils'

import LoadingScreen from '../../components/LoadingScreen'
import ComingSoon from '../../components/CommingSoon'

import { NumericFormat } from 'react-number-format'

import { showNotification } from '@mantine/notifications'
import { MdCheck } from 'react-icons/md'
import { PulseLoader } from 'react-spinners'

export interface IWalletProps { }

const Wallet = ({ }: IWalletProps) => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('Wallet')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const router = useRouter()
  const { wid } = router.query
  const q = router.query['q']

  const { me } = useMe()

  const [stablecoinRate, setStableCoinRate] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [forceReload, setForceReload] = useState(false);

  useEffect(() => {
    const abortController = new AbortController()
    ///console.log(q)
    const fetchRate = async () => {
      try {
        const res = await axios.get('/api/get-stablecoin-rate', {
          signal: abortController.signal,
        })

        setStableCoinRate(res?.data?.data?.data?.rate)
      } catch (error) { }
    }
    if (wid == 'usdt' || wid == 'usdc') {
      fetchRate()
    }

    return () => {
      abortController.abort
    }
  }, [wid])
  const downloadRef = useRef<HTMLDivElement>(null)

  //cor/usdt
  const { data, error } = useSWR(`get-wallet${wid}`, () =>
    axios.get(`/api/get-wallet/?wallet=${q}`).then(res => res.data.data),
  )

  // console.log("current address",address);
  const { data: rates } = useSWR('/api/get-rates?regenerate=true', () =>
    axios.get(`/api/get-rates`).then(res => res.data.data.data.rate.rate),
  )

  const generateCoinName = (wid: any) => {
    let coinName
    switch (wid) {
      case 'usdt':
        coinName = q != 'cor/usdte'? 'USDT-TRC20' : 'USDT-ERC20';
        break
      case 'eth':
        coinName = 'Ethereum'
        break
      case 'btc':
        coinName = 'Bitcoin'
        break
      case 'doge':
        coinName = 'Doge'
        break
      case 'ltc':
        coinName = 'Litecoin'
        break
      case 'dai':
        coinName = 'DAI'
        break
      case 'bch':
        coinName = 'Bitcoin Cash'
        break
      case 'trx':
        coinName = 'Tron'
        break
      case 'bnb':
        coinName = 'BNB-BSC'
        break
      case 'sol':
        coinName = 'Solana'
        break
      case 'ada':
        coinName = 'Cardano'
        break
      case 'usdc':
        coinName = 'USDC-ERC20'
        break
    }
    return coinName
  }

  // grap current address 
  const [address, setAddress] = useState(data?.data?.walletAddress);
  const [regenLoading, setRegenLoading] = useState(false);

  useEffect(() => {
    setAddress(data?.data?.walletAddress);
  }, [data])

  const regenerateAddress = () => {
    setRegenLoading(true);
    axios.get(`/api/regenerate-address/?wallet=${wid}`)
      .then((response) => {
        if (response.status === 200) {
          setAddress(response.data?.data?.data?.walletAddress);
          mutate(`get-wallet${wid}`);
        }
      })
      .catch(error => console.log(error))
      .finally(() => setRegenLoading(false));
  }

  const copyToClipboard = (text: string) => {
    copy(text)
    setCopied(true)
    showNotification({
      id: 'cat',
      message: 'Copied',
      color: 'green',
      autoClose: 5000,
      icon: <MdCheck />,
    })
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }
  if (!data && !error) return <LoadingScreen />
  if (!data?.data?.walletAddress)
    return <ComingSoon message={wid?.toString()} />



  const getDepositAmount = () => {
      switch (wid) {
        case 'usdt':
          return (q != 'cor/usdte')? 2 : 5;
        case 'eth':
          return 0.01;
        case 'btc':
          return 0.0001;
        case 'doge':
          return 1;
        case 'ltc':
          return 0.01
        case 'dai':
          return 5
        case 'bch':
          return 0.001
        case 'trx':
          return 10
        case 'bnb':
          return 0.01
        case 'ada':
          return 2
        case 'usdc':
          return 5
      }
  }


  return (
    <>
      <div tw="flex w-full items-center  px-4">
        <div tw="flex items-baseline py-3">
          <Image
            tw="mx-auto"
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
      <div tw="relative w-full px-4 py-3">
        <Group position="center">
          <div tw="flex flex-col items-center">
            <div id="qr" ref={downloadRef} tw="bg-white p-4 max-w-xs">
              {data && (
                <QRCode
                  value={address ?? ''}
                  level="H"
                  size={164}
                />
              )}
            </div>
            <p tw="text-sm text-black1 font-semibold  mt-2">Wallet Address</p>
            <p tw="text-sm text-black1 mt-2">{(address && address.length > 40)? address.slice(0,40) + '...' : address }</p>
            <div tw="my-4">

              {/* Disabled Regenerate Address button  */}
              {/* <button onClick={regenerateAddress} tw="text-primary">
                {regenLoading ?
                  <PulseLoader size={3} />
                  :
                  'Regenerate'
                }
              </button> */}
            </div>
          </div>
        </Group>
      </div>

      <p tw="w-full  border-b-4 border-gray9 " />

      {/* if no card is added hidden|flex*/}
      <div tw="w-full px-4 py-3">
        <div tw="flex flex-col space-y-4">
          <div tw="flex flex-row space-x-8">
            <div>
              <Group tw="rounded-full p-3 bg-[#F0F3F6]" position="center">
                <FaDollarSign size="18" />
              </Group>
            </div>
            <div tw="">
              <p tw="text-sm text-black1">
                This is your personal{' '}
                <span tw="font-medium">{generateCoinName(wid)}</span> wallet.
              </p>
              {/* <p tw="text-sm text-red-600 font-[500]">

                <AiOutlineWarning style={{ display: "inline", marginTop: '-4px' }} />
                This wallet changes automatically every month and the old one will
                expire. You can Regenerate a new address everytime you want to trade.
              </p> */}
            </div>
          </div>

          <div tw="flex flex-row items-center space-x-8">
            <div>
              <Group tw="rounded-full p-3 bg-[#F0F3F6]" position="center">
                <FaCoins size="18" />
              </Group>
            </div>

            <p tw="text-sm text-black1">
              All coins received are instantly converted to naira using the rate
              displayed and credited into your naira wallet.
            </p>
          </div>

          <div tw="flex flex-row items-center space-x-8">
            <div>
              <Group tw="rounded-full p-3 bg-[#F0F3F6]" position="center">
                <AiFillBank size="18" />
              </Group>
            </div>
            <p tw="text-sm text-black1">
              {' '}
              Any amount in your naira wallet is available for instant
              withdrawal to your bank account.
            </p>
          </div>

          <div tw="flex flex-row items-center space-x-8">
            <div>
              <Group tw="rounded-full p-3 bg-[#F0F3F6]" position="center">
                <IoMdAlert size="18" />
              </Group>
            </div>
            <p tw="text-sm text-black1">
              {' '}
              Only send <span tw="font-medium">{generateCoinName(wid)}</span> to
              this wallet address.<br/>
              { 
                <span tw="text-red-600">min deposit: { `${getDepositAmount()} ${wid.toUpperCase()}` }</span>
              }
            </p>
          </div>
        </div>

        <div tw="py-5">
          <p tw="text-black2 text-sm text-left font-bold">Rate table</p>
          <div tw="mt-3">
            <div tw="w-full flex justify-between p-3 bg-[#F0F3F6]">
              <p>VALUE</p>
              <p>RATE</p>
            </div>
          </div>
          <div tw="grid grid-cols-1 divide-y">
            {!stablecoinRate ? (
              rates?.map((rate: any, index: number) => (
                <div key={index}>
                  <div tw="w-full flex justify-between p-3">
                    <p tw="font-bold">
                      {rate.min} to {rate.max}
                    </p>
                    <p tw="font-bold">{rate.rateValue}/$</p>
                  </div>
                </div>
              ))
            ) : (
              <div tw="w-full flex justify-between p-3">
                <p tw="font-bold">0 to 10000000</p>
                <p tw="font-bold">{stablecoinRate}/$</p>
              </div>
            )}
          </div>
        </div>

        <div tw="w-full inline-flex space-x-2 justify-evenly">
          <a tw="w-full">
            <Button
              tw="bg-gray-200 text-black mb-9 text-sm"
              size="lg"
              fullWidth
              type="submit"
              onClick={() => exportAsImage(downloadRef.current, 'qr-code')}
            >
              Download QR Code
            </Button>
          </a>

          <Button
            tw="bg-primary text-white mb-9 text-sm"
            size="lg"
            fullWidth
            type="submit"
            onClick={() => copyToClipboard(address)}
            css={copied ? tw`bg-green-500` : ''}
          >
            Copy
          </Button>
        </div>
      </div>
    </>
  )
}
Wallet.auth = true
Wallet.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {/* <Back /> */}
      <AppTab />
      {page}
    </Layout>
  )
}

export default Wallet
