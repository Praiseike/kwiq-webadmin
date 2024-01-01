import * as React from 'react';
import Image from 'next/image'


import { Button, Avatar, Text, Badge, Tabs, TextInput, Select } from '@mantine/core'
import tw from 'twin.macro'
import { MdArrowForwardIos, MdSearch } from 'react-icons/md';
import { FaChevronDown } from 'react-icons/fa';

import style from '../styles/Styles'
export interface CardListProps {
    cards: [{}]
}

const options = [
    { value: 'react', label: 'React' },
    { value: 'ng', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'vue', label: 'Vue' },
]

export function CardList({ cards }: CardListProps) {
    return (
        <>
            {/* this filters the list */}
            <form action="" tw="w-full inline-flex space-x-3 my-4">
                <TextInput
                    tw="w-full rounded-full"
                    required
                    placeholder="Search"
                    icon={<MdSearch size="24" />}
                    size="md"
                    styles={
                        {
                            input: style.input.search,
                            error: style.input.error,
                        }
                    }
                />
            </form>
            {cards && cards.map((card:any, index:number) => {
                <div key={index} tw="block w-full border-b-[1px] border-b-[hsl(230 33% 86%)] pb-4">
                    <div tw="w-full flex justify-between items-center">
                       
                        <div tw="inline-flex items-center space-x-2">
                            <Image
                            src={card?.image}
                            alt="card image"
                            width="38"
                            height="24"
                            />
                            <p tw="text-xs text-gray2/75">{card.category}</p>
                        </div>
                        <MdArrowForwardIos color="gray" />

                    </div>

                </div>
            })
            }

        </>

    );
}
