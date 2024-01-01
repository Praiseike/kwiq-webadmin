import { ReactElement, useEffect, useRef, useState } from 'react'

import tw from 'twin.macro'

import Layout from '../layouts/layout'
import AppTab from '../layouts/home'
import Back from '../layouts/back'

import { Tabs, Loader, Group, Badge } from '@mantine/core'

import { NotificationList } from '../components/NotificationList'

import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'

import Style from '../styles/Styles'

import { useDashboard, useNotifications } from '../hooks/api'
dayjs.extend(relativeTime)

export interface INotificationsProps {}

import { useAtom } from 'jotai'
import { activeHomeTabAtom } from '../stores'
import axios from 'axios'

const Notifications = (props: INotificationsProps) => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)

  const abortController = new AbortController()

  const markRead = async () => {
    try {
      await axios.patch(
        '/api/mark-notifications-as-read',
        {},
        {
          signal: abortController.signal,
        },
      )
    } catch (e: any) {}
  }

  useEffect(() => {
    setActiveTab('Settings')
    markRead()

    return () => {
      abortController.abort
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { notifications, size, setSize, isLoadingMore, isReachingEnd } =
    useNotifications()

  const [activeTab, setActiveTabX] = useState<string | null>('transactions')
  return (
    <>
      <Tabs
        tw="w-full my-3"
        defaultValue={activeTab}
        onTabChange={setActiveTabX}
        styles={theme => ({
          ...theme.fn.focusStyles(),
          tabsList: tw`bg-[#E7E9F3] rounded-full text-gray2 p-1`,
          tabLabel: tw`text-lg text-black font-medium`,
          tab: tw`border-b-0`,
        })}
      >
        <Tabs.List grow>
          <Tabs.Tab value="transactions">Transactions</Tabs.Tab>
          {/*  <Tabs.Tab value="Messages">Messages</Tabs.Tab> */}
        </Tabs.List>
        <Tabs.Panel value="transactions" pt="xs">
          <div tw="space-y-4 mt-3">
            {notifications?.map((notification: any, index: number) => {
              return notification?.data?.data?.map(
                (item: any, index: number) => (
                  <NotificationList {...item} key={index} />
                ),
              )
            })}
            <Group mt="xl" position="center">
              {!isReachingEnd ? (
                <>
                  {!isLoadingMore && (
                    <Badge onClick={() => setSize(size + 1)}>load more</Badge>
                  )}
                  {isLoadingMore && <Loader variant="dots" />}
                </>
              ) : (
                ''
              )}
            </Group>
          </div>
        </Tabs.Panel>
      </Tabs>
    </>
  )
}
Notifications.auth = true
Notifications.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back
        title={
          <p css={Style.text.md} tw="text-black1 font-bold">
            Notifications
          </p>
        }
      />
      <AppTab />
      <div tw="px-4 py-2 w-full">{page}</div>
    </Layout>
  )
}

export default Notifications
