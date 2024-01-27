import React, { ReactElement } from 'react'

import tw from 'twin.macro'

import Layout from '../layouts/layout'
import AppTab from '../layouts/home'
import Back from '../layouts/back'

import Image from 'next/image'

import Style from '../styles/Styles'
import { FiChevronRight } from 'react-icons/fi'
import { HiChatAlt } from 'react-icons/hi'
import Link from 'next/link'

Style

export interface ISupportProps { }

const Support = (props: ISupportProps) => {
  return (
    <>
      <div tw="w-full ">
        <p tw="mt-5" css={Style.text.md}>
          Support
        </p>
        <p css={Style.text.smfull} tw="mt-3 text-left">
          Contact us
        </p>
      </div>
      <Link href="/chat" passHref>
        <div tw="w-full space-x-2 flex items-center rounded-xl bg-black6 px-3 py-3 mt-3">
          <HiChatAlt color="blue" size="20" />
          <p tw="flex-1 px-2" css={Style.text.smbold}>
            Live chat
          </p>
          <FiChevronRight tw="grow-0" />
        </div>
      </Link>

      <a href="mailto:help@kwiq.app">
        <div tw="w-full space-x-2 flex items-center rounded-xl bg-black6 px-3 py-3 mt-3">
          <Image
            src="/img/gmail.png"
            width={20}
            height={20}
            alt="gmail icon"
          />
          <p tw="flex-1 px-2" css={Style.text.smbold}>
            Send us a mail
          </p>
          <FiChevronRight tw="grow-0" />
        </div>
      </a>
      <a href="tel:+2348098460000">
        <div tw="w-full space-x-2 flex items-center rounded-xl bg-black6 px-3 py-3 mt-3">
          <Image
            src="/img/callicon.svg"
            width={20}
            height={20}
            alt="call icon"
          />
          <p tw="flex-1 px-2" css={Style.text.smbold}>
            Call Us
          </p>
          <FiChevronRight tw="flex-grow-0" />
        </div>
      </a>
      <div tw="w-full ">
        <p css={Style.text.smfull} tw="mt-10 text-left">
          Follow Us
        </p>
      </div>

      <a
        rel="noreferrer"
        target="_blank"
        href="https://m.facebook.com/kingcardsng1"
      >
        <div tw="w-full space-x-2 flex items-center rounded-xl bg-black6 px-3 py-3 mt-1">
          <Image
            src="/img/facebookicon.svg"
            width={20}
            height={20}
            alt="facebook icon"
          />
          <p tw="flex-1 px-2" css={Style.text.smbold}>
            Facebook
          </p>
          <FiChevronRight tw="flex-grow-0" />
        </div>
      </a>

      <a
        rel="noreferrer"
        target="_blank"
        href="https://www.instagram.com/kwiq.app/"
      >
        <div tw="w-full space-x-2 flex items-center rounded-xl bg-black6 px-3 py-3 mt-3">
          <Image
            src="/img/instagramicon.svg"
            width={20}
            height={20}
            alt="instagram icon"
          />

          <p tw="flex-1 px-2" css={Style.text.smbold}>
            Instagram
          </p>
          <FiChevronRight tw="flex-grow-0" />
        </div>
      </a>
    </>
  )
}

Support.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back />
      <div tw="px-4 py-5 w-full">{page}</div>
      <AppTab />
    </Layout>
  )
}

export default Support
