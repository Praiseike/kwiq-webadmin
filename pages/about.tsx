import { ReactElement, useEffect, useState } from 'react'

import Image from 'next/image'

import Layout from '../layouts/layout'
import Back from '../layouts/back'
import AppTab from '../layouts/home'

import tw from 'twin.macro'

import { useAtom } from 'jotai'
import { activeHomeTabAtom } from '../stores'

interface AboutProps {}

const About = ({}: AboutProps) => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('More')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Image
        src="/img/abouticon.svg"
        width={106}
        height={103}
        alt="icon"
        tw="mx-auto"
      />

      <p tw="w-full text-2xl font-medium px-4 text-center mt-5">Who is Kwiq?</p>

      <div tw="w-full px-5 text-left mt-5">
        KWIQ was created in 2017 as a reliable way to trade different kinds of
        crypto like Bitcoin, USDT, Ethereum, alongside Gift cards like Steam,
        Razergold, Sephora, Nordstrom instantly. In few mins, your trade will be
        approved and your account credited instantly. No delays, no wait time.
        <p tw="font-semibold py-5">How we work?</p>
        With over 100 thousand users and positive reviews, KWIQ offers the
        safest, easiest and fastest way for its users across Nigeria to trade
        securely and get cash instantly to their bank accounts. As a user, you
        have a personalized wallet after signup. Using your wallet created by
        KWIQ, you can receive Bitcoin, USDT, ETH from any part of the world and
        it will be converted to naira at the best rate for you.
        <p tw="font-semibold py-5">Why us?</p>
        We believe that everybody deserves a chance at financial freedom, and we
        offer you a chance at it. That is why we undoubtedly offer the best
        rates for both gift cards and crypto in the market. For assurance, you
        can download the KWIQ app or check our website to verify rates. KWIQ by
        KINGCARDS is and remains the best platform for trading in Nigeria. Our
        easy-to-use App has other benefits like buying airtime or paying bills
        at no cost. It is available for download both on Google play Store and
        App store for Android and iOS users&apos; nationwide. Buy, sell, save,
        refill, withdraw and pay bills with the best in the game.
        <p tw="font-semibold py-5">Contact us</p>
        Most importantly, we encourage you to ask questions if you are ever in
        doubt. Our expert customer support group is available 24/7 to answer
        your questions and attend to your needs.
      </div>
    </>
  )
}

About.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back />
      <AppTab />
      <div tw="mb-8">{page}</div>
    </Layout>
  )
}

export default About
