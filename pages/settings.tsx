import { ReactElement, useEffect, useState } from 'react'
import tw from 'twin.macro'

import Layout from '../layouts/layout'
import AppTab from '../layouts/home'
import Back from '../layouts/back'

import Link from 'next/link'
import Image from 'next/image'

import { TextInput, Button } from '@mantine/core'

import { MdSearch } from 'react-icons/md'

import style from '../styles/Styles'

import { useAtom } from 'jotai'
import { activeHomeTabAtom } from '../stores'

import { signOut } from 'next-auth/react'

export interface ISettingsProps {}

const Settings = ({}: ISettingsProps) => {
  const [activeTab, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab(activeTab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const allSettings = [
    {
      setting: 'Profile',
      desc: 'Change your personal information',
      icon: '/img/settings/profileicon.svg',
      link: '/profile',
    },
    {
      setting: 'Bonus Meter',
      desc: 'Check if you can recieve a bonus',
      icon: '/img/settings/bonus-meter.svg',
      link: '/progress',
    },
    {
      setting: 'Security',
      desc: 'Change your password',
      icon: '/img/settings/securityicon.svg',
      link: '/change-password',
    },
    {
      setting: 'Refer and earn',
      desc: 'Check out our referral bonus',
      icon: '/img/settings/refericon.svg',
      link: '/refer',
    },
    {
      setting: 'FAQ',
      desc: 'Questions? Check our FAQ',
      icon: '/img/settings/faqicon.svg',
      link: '/faq',
    },
    {
      setting: 'Support',
      desc: 'Contact our customer care',
      icon: '/img/settings/supporticon.svg',
      link: '/support',
    },
    {
      setting: 'About us',
      desc: 'What to know about Kings Cards',
      icon: '/img/settings/abouticon.svg',
      link: '/about',
    },
    {
      setting: 'Terms and Conditions',
      desc: 'Our rules, policies and terms of service',
      icon: '/img/settings/termsicon.svg',
      link: '/terms',
    },
  ]

  const [settings, setSettings] = useState(allSettings)
  const [search, setSearch] = useState('')

  const handleSearch = (e: any) => {
    const searched = allSettings.filter(
      setting =>
        setting.setting.toLowerCase().indexOf(e.target.value.toLowerCase()) >
        -1,
    )
    setSearch(e.target.value)
    setSettings(searched)
  }
  return (
    <>
      <p tw="w-full text-2xl font-medium ">Settings</p>
      <form action="" tw="w-full inline-flex space-x-3 my-4">
        <TextInput
          tw="w-full rounded-full"
          required
          placeholder="Search settings"
          icon={<MdSearch size="24" />}
          size="md"
          value={search}
          onChange={handleSearch}
          styles={{
            input: style.input.search,
            error: style.input.error,
          }}
        />
      </form>

      {settings &&
        settings.map((setting: any, index: number) => (
          <div
            key={index}
            tw="block w-full border-b-[0.1px] border-b-[hsl(230 33% 86%)] py-4"
          >
            <Link passHref href={setting.link}>
              <div tw="w-full flex justify-between items-center cursor-pointer">
                {/* leftSection */}
                <div tw="inline-flex items-center space-x-2">
                  <Image
                    src={setting.icon}
                    height={40}
                    width={40}
                    alt="settingss"
                  />

                  <div tw="block">
                    <p tw="[font-size:14px] text-black1 font-medium">
                      {setting.setting}
                    </p>
                    <p tw="[font-size:12px] text-black2">{setting.desc}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      <Button
        onClick={() => signOut()}
        tw="bg-primary mt-5"
        size="lg"
        fullWidth
        type="submit"
      >
        Sign out
      </Button>
    </>
  )
}
Settings.auth = true
Settings.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back />
      <AppTab />
      <div tw="px-4 py-5 w-full">{page}</div>
    </Layout>
  )
}

export default Settings
