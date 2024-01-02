import useSWR from 'swr'
import axios from 'axios'
import { getSession, signOut } from 'next-auth/react'
import useSWRInfinite from 'swr/infinite'
import { getToken } from 'next-auth/jwt'

export const fetcher = async (url: string) => {
  const token = getSession();
  const res = await axios
    .get(url)
    .then(res => res.data)
    .catch(e => {
      if (e?.response?.data?.data?.message == 'Unauthorized') {
        signOut()
      }

      if (e?.response?.data?.message == 'Unauthorized') {
        signOut()
      }

      if (e?.response?.status == 401) {
        signOut()
      }
    })
  return res
}

export function useMe() {
  const { data, error, mutate } = useSWR('/api/me', fetcher, {})
  return {
    me: data?.data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export function useUserBonus() {
  const { data, error, mutate } = useSWR('/api/fetch-bonus-amount', fetcher)
  return {
    data: data?.data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export function useDashboard() {
  const { data, error } = useSWR('/api/user-dashboard', fetcher)
  return {
    dashboard: data?.data.data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useSession() {
  const { data, error } = useSWR('/api/auth/session', fetcher)
  return {
    session: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useTranaction(tid: string | string[]) {
  const { data, error } = useSWR(`/api/get-transaction/?tid=${tid}`, fetcher)
  return {
    transaction: data?.data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useGiftCards() {
  //const fetcher = async(url:string) => await axios.get(url).then(res => res.data)
  const { data, error } = useSWR('/api/fetch-gift-cards', fetcher)

  return {
    cards: data?.data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useBanks() {
  const { data, error } = useSWR('/api/banks', fetcher)
  return {
    banks: data?.data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useNotifications() {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData?.data?.data?.length) {
      return null
    }
    return `/api/user-notifications?limit=10&page=${pageIndex + 1}` // SWR key
  }
  const { data, error, size, setSize } = useSWRInfinite<any, any>(
    getKey,
    fetcher,
    {
      initialSize: 1,
    },
  )
  return {
    notifications: data,
    isLoading: !error && !data,
    isError: error,
    isLoadingMore:
      (!error && !data) ||
      (size > 0 && data && typeof data[size - 1] === 'undefined'),
    isEmpty: data?.[0]?.length === 0,
    isReachingEnd:
      data?.[0]?.length === 0 || (data && data[data.length - 1]?.length < 10),
    getKey,
    size,
    setSize,
  }
}

export function useTransactions() {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (
      previousPageData &&
      !previousPageData?.data?.data?.transactions.length
    ) {
      return null
    }
    return `/api/user-transactions?limit=10&page=${pageIndex + 1}` // SWR key
  }
  const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher, {
    initialSize: 1,
  })
  return {
    transactions: data,
    isLoading: !error && !data,
    isError: error,
    isLoadingMore:
      (!error && !data) ||
      (size > 0 && data && typeof data[size - 1] === 'undefined'),
    isEmpty: data?.[0]?.length === 0,
    isReachingEnd:
      data?.[0]?.length === 0 || (data && data[data.length - 1]?.length < 10),
    getKey,
    size,
    setSize,
  }
}

export function useMessages() {
  const { data, error, mutate } = useSWR(
    'api/get-single-conversation/?id=60967ce06c9e1e0015399a1c',
    fetcher,
  )
  return {
    messages: data?.data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export function useUserConversation() {
  const { data, error, mutate } = useSWR('api/get-user-conversations/', fetcher)
  return {
    messages: data?.data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}
