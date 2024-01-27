import { MouseEvent, ReactElement, useEffect, useState } from 'react'

import tw from 'twin.macro'

import Layout from '../../layouts/layout'
import AppTab from '../../layouts/home'
import Back from '../../layouts/back'

import Link from 'next/link'
import Image from 'next/image'

import { Badge, Button } from '@mantine/core'

import { IoArrowForwardOutline } from 'react-icons/io5'
import { FiArrowUpRight } from 'react-icons/fi'

import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import Style from '../../styles/Styles'
dayjs.extend(relativeTime)

import { useAtom } from 'jotai'
import { activeHomeTabAtom } from '../../stores'
import AlertPopup from '../../components/AlertPopup';

export interface ISellCryptoProps { }

const SellCrypto = ({ }: ISellCryptoProps) => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  const [isVisible, setIsVisible] = useState(false);
  const [type, setType] = useState('');

  useEffect(() => {
    setActiveTab('Wallet')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = (e: MouseEvent, type?: string) => {
    // e.preventDefault();
    // setType('');
    // setIsVisible(true);
  }

  return (
    <>
      {isVisible && <AlertPopup {...{ type, isVisible, setIsVisible, }} />}
      <div tw="w-full flex-col mt-2 ">
        <p tw="text-2xl font-semibold text-black1 w-4/5 text-left">
          Sell Bitcoins, USDT, ETH instantly
        </p>

        <div tw="grid grid-cols-2 gap-3 mt-5">
          <div tw="relative bg-[#faf1e4] rounded-lg">
            <Link passHref href="sell-crypto/btc?q=btc">
              <div tw="flex flex-row space-x-2 items-center py-7 px-3 cursor-pointer">
                <Image
                  src="/img/coins/btcicon.png"
                  height={32}
                  width={32}
                  alt="btc icon"
                />
                <div tw="block">
                  <p tw="text-black1 font-medium">BTC</p>
                  <p tw="text-black2 [font-size:10px]">Bitcoin Wallet</p>
                </div>
              </div>
            </Link>

            <div tw="absolute top-2 right-2">
              <FiArrowUpRight tw="text-yellow" />
            </div>
          </div>

          <div tw="relative bg-[#E6E7F0] rounded-lg">
            <Link onClick={(e: MouseEvent) => handleClick(e, '')} passHref href="sell-crypto/eth?q=eth">
              <div tw="flex flex-row space-x-2 items-center py-7 px-3 cursor-pointer">
                <Image
                  src="/img/coins/ethicon.png"
                  height={34}
                  width={34}
                  alt="eth icon"
                />
                <div tw="block">
                  <p tw="text-black1 font-medium">ETH</p>
                  <p tw="text-black2 [font-size:10px]">Ethereum Wallet</p>
                </div>
              </div>
            </Link>
            <div tw="absolute top-2 right-2">
              <FiArrowUpRight tw="text-[#181920]" />
            </div>
          </div>

          <div tw="relative bg-[#e4f2f2] rounded-lg">
            <Link passHref href="sell-crypto/usdt?q=cor/usdttrc20">
              <div tw="flex flex-row space-x-2 items-center py-7 px-3 cursor-pointer">
                <Image
                  src="/img/coins/usdticon.png"
                  height={34}
                  width={34}
                  alt="eth icon"
                />
                <div tw="block">
                  <p tw="text-black1 font-medium">USDT</p>
                  <p tw="text-black2 [font-size:10px]">Tether Wallet</p>
                </div>
              </div>
            </Link>
            <div tw="absolute top-2 right-2">
              <FiArrowUpRight tw="text-[#2f9e7d]" />
            </div>
          </div>

          <div tw="relative bg-[#f4f2e5] rounded-lg">
            <Link onClick={(e: MouseEvent) => handleClick(e, '')} passHref href="sell-crypto/doge?q=doge">
              <div tw="flex flex-row space-x-2 items-center py-7 px-3 cursor-pointer">
                <Image
                  src="/img/coins/dogeicon.png"
                  height={34}
                  width={34}
                  alt="eth icon"
                />
                <div tw="block">
                  <p tw="text-black1 font-medium">DOGE</p>
                  <p tw="text-black2 [font-size:10px]">Dogecoin Wallet</p>
                </div>
              </div>
            </Link>
            <div tw="absolute top-2 right-2">
              <FiArrowUpRight tw="text-[#d4b46d]" />
            </div>
          </div>

          <div tw="relative bg-[#e1e1f1] rounded-lg">
            <Link onClick={(e: MouseEvent) => handleClick(e, '')} passHref href="sell-crypto/ltc?q=ltc">
              <div tw="flex flex-row space-x-2 items-center py-7 px-3 cursor-pointer">
                <Image
                  src="/img/coins/ltcicon.png"
                  height={32}
                  width={32}
                  alt="ltc icon"
                />
                <div tw="block">
                  <p tw="text-black1 font-medium">LTC</p>
                  <p tw="text-black2 [font-size:10px]">Litecoin Wallet</p>
                </div>
              </div>
            </Link>

            <div tw="absolute top-2 right-2">
              <FiArrowUpRight tw="text-[#0000B3]" />
            </div>
          </div>

          <div tw="relative bg-[#e3e5e4] rounded-lg">
            <Link onClick={(e: MouseEvent) => handleClick(e, '')} passHref href="sell-crypto/dai?q=cor/dai">
              {/* <Link passHref href="sell-crypto/xrp?q=xrp"> */}
              <div tw="flex flex-row space-x-2 items-center py-7 px-3 cursor-pointer">
                <Image
                  src="/img/coins/Dai.png"
                  height={32}
                  width={32}
                  alt="xrp icon"
                />

                <div tw="block">
                  <p tw="text-black1 font-medium">DAI</p>
                  <p tw="text-black2 [font-size:10px]">ERC-20 Wallet</p>
                </div>
              </div>
            </Link>

            <div tw="absolute top-2 right-2">
              <FiArrowUpRight tw="text-black3" />
            </div>
          </div>

          <div tw="relative bg-[#e3eff8] rounded-lg">
            <Link onClick={(e: MouseEvent) => handleClick(e, '')} passHref href="sell-crypto/ada?q=cor/ada">
              <div tw="flex flex-row space-x-2 items-center py-7 px-3 cursor-pointer">
                <Image
                  src="/img/coins/cardano.png"
                  height={32}
                  width={32}
                  alt="dash icon"
                />
                <div tw="block">
                  <p tw="text-black1 font-medium">ADA</p>
                  <p tw="text-black2 [font-size:10px]">Cardano Wallet</p>
                </div>
              </div>
            </Link>

            <div tw="absolute top-2 right-2">
              <FiArrowUpRight tw="text-blue1" />
            </div>
          </div>

          <div tw="relative bg-[#e4f2f2] rounded-lg">
            <Link onClick={(e: MouseEvent) => handleClick(e, '')} passHref href="sell-crypto/bch?q=bch">
              <div tw="flex flex-row space-x-2 items-center py-7 px-3 cursor-pointer">
                <Image
                  src="/img/coins/bchicon.png"
                  height={34}
                  width={34}
                  alt="eth icon"
                />
                <div tw="block">
                  <p tw="text-black1 font-medium">BCH</p>
                  <p tw="text-black2 [font-size:10px]">Bitcoin Cash Wallet</p>
                </div>
              </div>
            </Link>
            <div tw="absolute top-2 right-2">
              <FiArrowUpRight tw="text-[#2f9e7d]" />
            </div>
          </div>

          <div tw="relative bg-[#fbeae5] rounded-lg">
            <Link onClick={(e: MouseEvent) => handleClick(e, '')} passHref href="sell-crypto/trx?q=cor/trx">
              <div tw="flex flex-row space-x-2 items-center py-7 px-3 cursor-pointer">
                <Image
                  src="/img/coins/trxicon.png"
                  height={34}
                  width={34}
                  alt="eth icon"
                />
                <div tw="block">
                  <p tw="text-black1 font-medium">TRX</p>
                  <p tw="text-black2 [font-size:10px]">Tron Wallet</p>
                </div>
              </div>
            </Link>
            <div tw="absolute top-2 right-2">
              <FiArrowUpRight tw="text-[#ef625b]" />
            </div>
          </div>

          <div tw="relative bg-[#f8f4e1] rounded-lg">
            <Link onClick={(e: MouseEvent) => handleClick(e, '')} passHref href="sell-crypto/bnb?q=cor/bnb">
              <div tw="flex flex-row space-x-2 items-center py-7 px-3 cursor-pointer">
                <Image
                  src="/img/coins/bnbicon.png"
                  height={34}
                  width={34}
                  alt="eth icon"
                />
                <div tw="block">
                  <p tw="text-black1 font-medium">BNB</p>
                  <p tw="text-black2 [font-size:10px]">Binance Wallet</p>
                </div>
              </div>
            </Link>
            <div tw="absolute top-2 right-2">
              <FiArrowUpRight tw="text-[#edc219]" />
            </div>
          </div>

          <div tw="relative bg-[#e4f2f2] rounded-lg">
            <Link onClick={(e: MouseEvent) => handleClick(e, '')} passHref href="sell-crypto/usdt?q=cor/usdte">
              <div tw="flex flex-row space-x-2 items-center py-7 px-3 cursor-pointer">
                <Image
                  src="/img/coins/usdticon.png"
                  height={34}
                  width={34}
                  alt="usdt icon"
                />
                <div tw="block">
                  <p tw="text-black1 font-medium">USDT</p>
                  <p tw="text-black2 [font-size:10px]">ERC-20 Wallet</p>
                </div>
              </div>
            </Link>
            <div tw="absolute top-2 right-2">
              <FiArrowUpRight tw="text-[#2f9e7d]" />
            </div>
          </div>

          <div tw="relative bg-[#e5ecf5] rounded-lg">
            <Link onClick={(e: MouseEvent) => handleClick(e, '')} passHref href="sell-crypto/usdc?q=usdc">
              <div tw="flex flex-row space-x-2 items-center py-7 px-3 cursor-pointer">
                <Image
                  src="/img/coins/usdcicon.png"
                  height={34}
                  width={34}
                  alt="usdc icon"
                />
                <div tw="block">
                  <p tw="text-black1 font-medium">USDC</p>
                  <p tw="text-black2 [font-size:10px]">USDC Wallet</p>
                </div>
              </div>
            </Link>
            <div tw="absolute top-2 right-2">
              <FiArrowUpRight tw="text-[#2a7bc0]" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
SellCrypto.auth = true
SellCrypto.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back
        rightDiv={
          <Link href="/leaderboard" passHref>
            <Button tw="bg-primary text-sm" size="md">
              Leaderboard
            </Button>
          </Link>
        }
      />
      <AppTab />
      <div tw="px-4 py-5 w-full">{page}</div>
    </Layout>
  )
}

export default SellCrypto
