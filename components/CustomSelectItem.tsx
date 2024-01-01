import { Avatar, Group, Text } from '@mantine/core'
import { forwardRef } from 'react'
import Image from 'next/image'
import tw from 'twin.macro'

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string
  label: string
  //description: string
  name: string
}

// eslint-disable-next-line react/display-name
const CustomSelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ name, image, label, ...others }: ItemProps, ref) => (
    <div
      tw="border-b-[1px] rounded-none last:border-0 border-gray-200"
      ref={ref}
      {...others}
    >
      <div tw="flex flex-row items-center py-0 ">
        <Image src={image} height="40" width="40" alt="flag" />

        <p tw="text-sm ">{label}</p>
      </div>
    </div>
  ),
)

export default CustomSelectItem
