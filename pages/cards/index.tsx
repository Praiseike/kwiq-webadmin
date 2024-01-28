import React, { ReactElement, useEffect, useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import tw from 'twin.macro'

import Layout from '../../layouts/layout'
import AppTab from '../../layouts/home'
import Back from '../../layouts/back'

import { Button, Drawer, TextInput } from '@mantine/core'

import { MdSearch } from 'react-icons/md'

import style from '../../styles/Styles'
import { useGiftCards } from '../../hooks/api'

import { useAtom } from 'jotai'
import { activeHomeTabAtom } from '../../stores'

import LoadingScreen from '../../components/LoadingScreen'

import CardTrade from '../../components/CardTrade'
import { useSession } from 'next-auth/react'

export interface IAllCardsProps { }

const AllCards = ({ }: IAllCardsProps) => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('Cards')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { cards: allCards, isLoading } = useGiftCards()
  const [cards, setCards] = useState([])
  const [card, setCard] = useState([])
  const [showCardTrade, setShowCardTrade] = useState(false)

  const [ pageStates, setPageStates ] = useState<any>(null);
  const session = useSession();
  useEffect(() => {
    setCards(allCards)
    //console.log(allCards[0].category)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  useEffect(() => {
    if(session && session.data){
      setPageStates(session.data.user.pageStates);
    }
  },[session]);

  const [search, setSearch] = useState('')

  const handleSearch = (e: any) => {
    const searched = allCards.filter(
      (item: any) =>
        item?.category?.toLowerCase().indexOf(e.target.value.toLowerCase()) >
        -1,
    )
    setSearch(e.target.value)
    setCards(searched)
  }

  const handleCardClick = (card: any) => {
    //console.log(card)
    setCard(card)
    setShowCardTrade(true)
  }

  if (isLoading == true) {
    return (
      <>
        <LoadingScreen />
      </>
    )
  } else
    return (
      <>
        <Back
          rightDiv={ pageStates ? (
            pageStates.leaderboard_page &&
            <Link href="/leaderboard" passHref>
              <Button tw="bg-primary text-sm" size="md">
                Leaderboard
              </Button>
            </Link>

          )
            : <></>
        }
        />
        <AppTab />
        
        <Drawer
          opened={showCardTrade}
          onClose={() => setShowCardTrade(false)}
          size="full"
          withCloseButton={false}
          zIndex={10}
          tw="overflow-y-scroll pb-6"
        >
          <div tw="flex w-full justify-between px-4 pt-5">
            <div tw="cursor-pointer">
              <Image
                src={'/img/back.svg'}
                width="24"
                height="24"
                alt="go back"
                onClick={() => setShowCardTrade(false)}
              />
            </div>
          </div>
          <CardTrade card={card} setShowAction={setShowCardTrade} />
        </Drawer>
        <div tw="w-full px-4 py-5">
          <p tw="w-full text-2xl font-semibold ">Cards</p>
          <form action="" tw="w-full inline-flex space-x-3 my-4">
            <TextInput
              tw="w-full rounded-full"
              required
              placeholder="Search"
              icon={<MdSearch size="24" />}
              size="xl"
              value={search}
              onChange={handleSearch}
              styles={{
                input: style.input.search,
                error: style.input.error,
              }}
            />
          </form>

          <div tw="grid grid-cols-2 gap-2 ">
            {cards?.map((card: any, index: number) => (
              <div
                key={index}
                onClick={() => handleCardClick(card)}
                tw="w-full flex flex-col items-center cursor-pointer"
              >
                {/* leftSection */}
                <div tw=" items-center">
                  <Image src={card?.image} width="140" height="95" alt="" />
                </div>
                <p tw="text-sm text-black1">{card?.category}</p>
              </div>
            ))}
          </div>
        </div>


      </>
    )
}



AllCards.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default AllCards;
