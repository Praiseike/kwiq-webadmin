import * as React from 'react'
import { ReactElement, useEffect, useState } from 'react'

import tw from 'twin.macro'

import Image from 'next/image'

import Layout from '../layouts/layout'
import Back from '../layouts/back'
import AppTab from '../layouts/home'

import { useAtom } from 'jotai'
import { activeHomeTabAtom } from '../stores'

interface TermsProps {}

const Terms = (props: TermsProps) => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('More')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Image
        src="/img/termsicon.svg"
        width="108"
        height="125"
        alt="terms icon"
      />

      <p tw="w-full text-2xl font-medium px-4 text-center mt-5">
        Terms and Conditions
      </p>

      <div tw="w-full px-10 text-left mt-5">
        By registering and opening an account to use KWIQ&apos;s Services,
        you have unconditionally agreed to and accept the terms and conditions
        stated hereunder:
        <ul tw="list-decimal">
          <li>
            You undertake not to use KWIQ&apos;s products and services to
            facilitate any illegal activities.
          </li>
          <li>
            The information contained on this website does not constitute
            accounting, legal, financial, consulting, investment or other
            professional advice. You bear all the risks from any decision to use
            KWIQ and KWIQ shall not be liable for any loss suffered.
          </li>

          <li>
            Your account may be terminated if we discover that you have provided
            us with false or misleading information, or refuse to provide
            correct information about your true identity.
          </li>

          <li>
            You agree and consent to receive correspondence from KWIQ via
            email, SMS, app notifications, social media, letters or any other
            media we use. You are responsible for maintaining adequate security
            and control of any and all IDs, passwords, personal identification
            numbers (PINs), or any other codes or credentials that you use to
            access the services.
          </li>

          <li>
            You are not allowed to sell, borrow, share or otherwise make
            available your account or any detail necessary to access your
            account to people or entities other than yourself.
          </li>

          <li>
            Your account shall not contain misleading or fraudulent information,
            including, but not limited to, having a non-personal phone number,
            creating fake reputation information for your account, faking your
            country of origin or providing fraudulent identification documents.
          </li>

          <li>
            We may at any time require you to complete our ID verification
            process and may also require you to submit additional identification
            documents to us if we deem it necessary. Failing to complete ID
            verification will be considered a violation of these Terms.
          </li>

          <li>
            KWIQ may change these Terms of Use at any time for any reason
            without notice.
          </li>

          <li>
            KWIQ may suspend your account at any time for any reason.
          </li>
        </ul>
      </div>

      <p tw="w-full text-2xl font-medium px-4 text-center mt-5">
        Prohibitted Activities
      </p>
      <div tw="w-full px-10 text-left my-5">
        KWIQ strives to attain and maintain the highest security culture
        and compliance standards to government laws and regulations as well as
        protection of our customers. Engaging in any of the prohibited
        activities specified below may give rise to prosecution by law
        enforcement agencies.
        <br />
        The following acts are prohibited on KWIQ&apos;s web, mobile, app
        or other platforms.
        <ul tw="list-decimal">
          <li>
            Gathering, stealing or engaging in unauthorized collection of
            information about users.
          </li>
          <li>
            Changing, amplifying or modifying any part of the site or the
            services for any purpose whatsoever.
          </li>

          <li>
            Disguising identity or user credentials, use of another user&apos;s
            credentials in engaging with KWIQ.
          </li>

          <li>
            Alter-engineering, reverse-engineering or otherwise tampering with
            KWIQ&apos;s platform in order to find limitations or
            vulnerabilities.
          </li>
          <li>
            Covert engineering of products/services for unauthorized purposes.
          </li>
        </ul>
      </div>
    </>
  )
}

Terms.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back />
      {/* <AppTab /> */}
      {page}
    </Layout>
  )
}

export default Terms
