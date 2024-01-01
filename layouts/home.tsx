import tw from 'twin.macro'
import { useEffect, useState, useRef, ReactElement } from 'react'

import { useRouter, usePathname } from 'next/navigation'

import { Affix, Tabs } from '@mantine/core'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

import { BsCreditCardFill } from 'react-icons/bs'
import { FiHome } from 'react-icons/fi'
import { MdSyncAlt } from 'react-icons/md'
import { ImStack } from 'react-icons/im'
import { BiLoaderCircle } from 'react-icons/bi'

import { activeHomeTabAtom } from '../stores'
import { useAtom } from 'jotai'
import { getSession, useSession } from 'next-auth/react'

export interface AppTabProps {
  children?: ReactElement;
  pageStates?: any;
}



const AppTab = ({ children, pageStates }: AppTabProps) => {
  const router = useRouter()
  const [hideOnScroll, setHideOnScroll] = useState(true)
  const elementRef = useRef()
  const [activeTab, setActiveTabAtom] = useAtom(activeHomeTabAtom)
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    getSession()
      .then((data: any) => {
        setSessionData(data)
      })
  }, [])

  pageStates = sessionData?.user?.pageStates;

  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y
      if (isShow !== hideOnScroll) setHideOnScroll(isShow)
    },
    [hideOnScroll],
    elementRef,
    false,
    300,
  )

  return (
    <>
      {children}
      <Affix
        zIndex={50}
        tw="max-w-lg mx-auto"
        position={{ bottom: 0, left: 0, right: 0 }}
      >
        <Tabs
          variant="default"
          styles={() => ({
            tabControl: tw`bg-white text-gray2 m-0.5`,
            tabActive: tw`text-primary`,
            tabsListWrapper: tw`border-t-[1px] border-t-[#E7E9F3] `,
            tabLabel: tw`text-[11px]`,
            tab: tw`flex flex-col space-y-1 items-center`,
            tabIcon: tw`!m-0 `,
          })}
          tw="bg-white "
          defaultValue={activeTab}
          value={activeTab}
          onTabChange={value => {
            setActiveTabAtom(value)
            router.push(
              value?.toString().toLocaleLowerCase() === 'home'
                ? '/'
                : `/${value?.toString().toLocaleLowerCase()}` ?? '',
            )
          }}
        >
          <Tabs.List grow>
            <Tabs.Tab tw="mr-0" value="Home" icon={<FiHome size={24} />}>
              Home
            </Tabs.Tab>
            {
              pageStates && pageStates?.giftcard_page && 
              <Tabs.Tab value="Cards" icon={<BsCreditCardFill size={24} />}>
                Cards
              </Tabs.Tab>
            }

            <Tabs.Tab value="Transactions" icon={<MdSyncAlt size={24} />}>
              Transactions
            </Tabs.Tab>
            <Tabs.Tab value="Wallet" icon={<ImStack size={24} />}>
              Wallet
            </Tabs.Tab>
            <Tabs.Tab value="Settings" icon={<BiLoaderCircle size={24} />}>
              More
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Affix>
    </>
  )
}

export default AppTab
