import { TabsValue } from '@mantine/core'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

//export const getStared = atomWithStorage('getStarted', true)
export const goBackAtom = atom(false)
export const atomStep = atom(1)
export const atomStepMessage = atom('Step 1 of 3')
export const activeHomeTabAtom = atom<
  TabsValue | 'Home' | 'Cards' | 'Transactions' | 'Wallet' | 'More'
>('Home')

//export const activeHomeTab = atom(0)
