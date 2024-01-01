import Image from 'next/image';
import React from 'react'
import tw from "twin.macro";
import Link from 'next/link';

export default function ChatBtn() {
  return (
    <Link href="/chat" passHref>
      <div tw="fixed z-[100] right-[1rem] bottom-[7rem] rounded-full bg-white shadow p-1 shrink-0 flex justify-center items-center">
        <span style={{ animation: 'ping-slow 2s infinite' }} tw="absolute z-[101] inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        <Image
          tw="z-[102] bg-white p-2 rounded-full shrink-0"
          src="/img/msg2.png"
          width={50}
          height={50}
          alt="chat button"
        />
      </div>
    </Link>
  )
}
