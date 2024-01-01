import { ReactElement, useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import tw from 'twin.macro'

import Layout from '../layouts/layout'
import AppTab from '../layouts/home'
import Back from '../layouts/back'

import { Group, Loader, Badge, Drawer } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'

import { useDashboard, useTranaction, useTransactions } from '../hooks/api'
import relativeTime from 'dayjs/plugin/relativeTime'

import dayjs from 'dayjs'
dayjs.extend(relativeTime)

import { activeHomeTabAtom } from '../stores'
import { useAtom } from 'jotai'

import Style from '../styles/Styles'
import LoadingScreen from '../components/LoadingScreen'
import { TransactionListItem } from '../components/TransactionListItem'

import Transaction from '../components/Transaction'

const Transactions = () => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('Transactions')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const router = useRouter()

  const [value, setValue] = useState('')
  const [debounced] = useDebouncedValue(value, 200)
  const [showTransaction, setShowTransaction] = useState(false)
  const [transaction, setTransaction] = useState<any>({})

  //const [transactions, setTransactions] = useState([])

  const {
    transactions,
    size,
    setSize,
    isLoading,
    isLoadingMore,
    isReachingEnd,
  } = useTransactions()

  /*  useEffect(() => {
         setTransactions(dashboard?.transactions)
         setFilterBy('')
         // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [dashboard])
  */
  /* useEffect(() => {

        if (filterBy == "") {
            setTransactions(dashboard?.transactions)
        } else {
            const temp = dashboard?.transactions.filter((item: any) => item?.status == filterBy)
            setTransactions(temp)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterBy])
 */
  if (isLoading) {
    return <LoadingScreen />
  }
  return (
    <>
      <Drawer
        opened={showTransaction}
        transition="pop"
        onClose={() => setShowTransaction(false)}
        size="full"
      >
        <div tw="px-4 py-3 w-full">
          <Transaction {...transaction} />
        </div>
      </Drawer>
      <p css={Style.text.md} tw="text-black1 font-semibold">
        Transactions
      </p>
      <div tw="space-y-1">
        {transactions?.map((transaction: any) => {
          return transaction?.data?.data?.transactions.map(
            (item: any, index: number) => (
              <div key={index}>
                <p tw="pl-2 text-sm text-black1 mt-3 mb-2">
                  {' '}
                  {dayjs(item?.createdAt).format('MMMM D, YYYY')}
                </p>
                <div
                  onClick={() => {
                    router.push(`transaction/${item?.tradeId}`)
                  }}
                >
                  <TransactionListItem {...item} />
                </div>
              </div>
            ),
          )
        })}

        <Group tw="py-3" position="center">
          {!isReachingEnd ? (
            <>
              {!isLoadingMore && !isReachingEnd && (
                <Badge onClick={() => setSize(size + 1)}>load more</Badge>
              )}
              {isLoadingMore && <Loader variant="dots" />}
            </>
          ) : (
            ''
          )}
        </Group>
      </div>
      {/*  {transactions && transactions.map((item: any, index: any) => (
                <TransactiontItem key={index} {...item} />
            ))} */}
    </>
  )
}
Transactions.auth = true
Transactions.getLayout = function getLayout(page: ReactElement) {
  return (
    <div tw="bg-gray-100">
      <Layout>
        <Back />
        <AppTab />
        <div tw="px-4 py-3 w-full">{page}</div>
      </Layout>
    </div>
  )
}

export default Transactions
