import Image from 'next/image'
import tw from 'twin.macro'
import dayjs from 'dayjs'
interface IAdminMessagesProp {
  message: {
    from: string
    _id: string
    message: string
    createdAt: string
    updatedAt: string
    lastMessage: [
      {
        conversation: string
        createdAt: string
        from: string
        isRead: boolean
        message: string
        to: string
        updatedAt: string
      },
    ]
    recipients: [any]
  }
  setOpened: (isOpen: boolean) => void
  setModalImage: (imageSrc: string) => void
}

const AdminMessages = ({
  message,
  setOpened,
  setModalImage,
}: IAdminMessagesProp) => {
  const fromMe = message.lastMessage[0]?.from == '60967ce06c9e1e0015399a1c'
  const messageIsImage = message.lastMessage[0]?.message.startsWith('http')
  return (
    <div tw="flex flex-col">
      <div css={[!fromMe && tw`self-end`, fromMe && tw`self-start`]}>
        {messageIsImage ? (
          <div tw="p-0.5 bg-primary flex items-center">
            <Image
              src={message.lastMessage[0]?.message}
              height="80"
              width="80"
              alt="trade image thumb"
              onClick={() => {
                setOpened(true), setModalImage(message.lastMessage[0]?.message)
              }}
            />
          </div>
        ) : (
          <p tw="px-6 py-2 text-white bg-primary max-w-xs rounded-3xl">
            {message.lastMessage[0]?.message}
          </p>
        )}
      </div>
      <span
        css={[!fromMe && tw`self-end `, fromMe && tw`self-start`]}
        tw="text-xs py-1 text-black3"
      >
        {dayjs(message?.updatedAt).format('MMM DD, YYYY h:m A')}
      </span>
    </div>
  )
}

export default AdminMessages
