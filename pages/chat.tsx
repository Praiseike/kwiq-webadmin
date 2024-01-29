import { ReactElement, useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import tw from 'twin.macro'

import axios from 'axios'

import { ActionIcon, Affix, TextInput, Modal, Paper } from '@mantine/core'
import { useViewportSize, useScrollIntoView } from '@mantine/hooks'

import Layout from '../layouts/layout'
import Back from '../layouts/back'

import style from '../styles/Styles'
import { MdOutlinePhone } from 'react-icons/md'
import { AiOutlineArrowUp, AiOutlinePlus } from 'react-icons/ai'

import { useMessages, useUserConversation } from '../hooks/api'
import imageCompression from 'browser-image-compression'
import dayjs from 'dayjs'

import { useSession } from 'next-auth/react'
import { unsuccessfullNotification } from '../libs/notifications'
import LoadingScreen from '../components/LoadingScreen'
import AdminMessages from '../components/chat/AdminMessages'
import { GetServerSidePropsContext } from 'next'

import { getToken } from 'next-auth/jwt'

export interface IChatProps { token: any }

const adminId = '60967ce06c9e1e0015399a1c'



const constructMessage = (message: string) => {
  return {
      _id: `${Math.random()}`,
      conversation: "658e8e4ea6511e28de199d18",
      to: adminId,
      from: "657e0c316943469dd3bc7356",
      message: message,
      isRead: true,
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString(),
      toObj: [
          {
              _id: adminId
          }
      ],
      fromObj: [
          {
              _id: "657e0c316943469dd3bc7356"
          }
      ]
  }
}



const Chat = (props: IChatProps) => {

  const { height, width } = useViewportSize()

  const { scrollIntoView, targetRef, scrollableRef } =
    useScrollIntoView<HTMLDivElement>()

  const { data: user } = useSession()
  const { messages, mutate, isLoading: isLoadingMessages } = useMessages()
  const { messages: userConvo, isLoading: isLoadingConverstions } =
    useUserConversation()

  const [opened, setOpened] = useState(false)
  const [modalImage, setModalImage] = useState('')
  const [message, setMesssage] = useState('')

  const [ newMessages, setNewMessages ] = useState(messages);

  const textInputRef = useRef<HTMLInputElement>(null)

  const hiddenFileInput = useRef<HTMLInputElement>(null)

  //if the sender is not admin

  useEffect(() => {
    scrollIntoView()
    setNewMessages(messages);
  }, [messages, scrollIntoView])

  useEffect(() => {

    scrollIntoView();
  },[newMessages,scrollIntoView()]);

  const handleClick = (event: any) => {
    hiddenFileInput?.current?.click()
  }

  const handleChange = (event: any) => {
    const fileUploaded = event.target.files[0]
    handleImageUpload(fileUploaded)
  }

  const createConversation = async (message: string) => {
    const newMessage = constructMessage(message);
    setNewMessages([...newMessages,newMessage]);
    setMesssage('')

    textInputRef?.current?.focus();
    setMesssage('')

    const nMessage = message
    try {
      const response = await axios.post('/api/create-conversation', {
        to: adminId,
        message: nMessage,
      })
      if (response.status == 200) {
        await mutate()
      }
    } catch (error: any) {
      unsuccessfullNotification({ message: error?.response?.data?.data?.message })
    }
  }

  const handleImageUpload = async (file: File) => {
    let src = ''
    const options = {
      maxSizeMB: 0.1,
    }
    if (file != null) {
      const compressedImage = await imageCompression(file, options)
      const form = new FormData()
      form.append('file', compressedImage)
      form.append('upload_preset', 'king-cards-unsigned')
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/king-cards/upload',
        {
          method: 'POST',
          body: form,
        },
      )
      const res = await response.json()
      src = res.secure_url
      //setMesssage(src)
      createConversation(src)
    }
  }

  if (isLoadingMessages && isLoadingConverstions) {
    return <LoadingScreen />
  }

  const capitalizeFirstLetter = (sentence: string) => {
    return sentence.replace(/(^\s*\w|[\.\!\?]\s*\w)/g, match => match.toUpperCase());
  }
  
  return (
    <div>
      <Modal opened={opened} onClose={() => setOpened(false)} centered>
        <Image src={modalImage} height="500" width="500" alt="trade image" />
      </Modal>

      <Paper
        ref={scrollableRef}
        style={{ overflowY: 'scroll', height: height - 110, flex: 1 }}
      >
        {user?.id == adminId ? (
          <div tw="space-y-4 pb-3">
            {userConvo &&
              userConvo.map((message: any, index: number) => (
                <div key={index}>
                  <AdminMessages
                    message={message}
                    setModalImage={setModalImage}
                    setOpened={setOpened}
                  />
                </div>
              ))}
          </div>
        ) : (
          <div tw="flex flex-col space-y-4 pb-3">
            {newMessages &&
              newMessages.map(
                (message: {
                  from: string
                  _id: string
                  message: string
                  createdAt: string
                }) => {
                  const fromMe = message.from != adminId
                  const messageIsImage = message.message.startsWith('http')
                  return (
                    <div key={message._id} tw="flex flex-col">
                      <div
                        css={[
                          fromMe && tw`self-end`,
                          !fromMe && tw`self-start`,
                        ]}
                      >
                        {messageIsImage ? (
                          <div tw="p-0.5 bg-primary flex items-center">
                            <Image
                              src={message.message}
                              height="80"
                              width="80"
                              alt="trade image thumb"
                              onClick={() => {
                                setOpened(true), setModalImage( message.message)
                              }}
                            />
                          </div>
                        ) : (
                          <p tw="px-6 py-2 text-white bg-primary max-w-xs rounded-3xl">
                            {capitalizeFirstLetter(message.message)}
                          </p>
                        )}
                      </div>
                      <span
                        css={[
                          fromMe && tw`self-end `,
                          !fromMe && tw`self-start`,
                        ]}
                        tw="text-xs py-1 text-black3"
                      >
                        {dayjs(message?.createdAt).format('MMM DD, YYYY h:mm A')}
                      </span>
                    </div>
                  )
                },
              )}
          </div>
        )}
        <p ref={targetRef}></p>
      </Paper>

      <Affix
        zIndex={50}
        tw="max-w-lg mx-auto px-3"
        position={{ bottom: 8, left: 0, right: 0 }}
      >
        <div tw="w-full inline-flex space-x-2 items-center bg-white py-1">
          <div>
            <ActionIcon
              onClick={handleClick}
              radius="xl"
              size="lg"
              variant="light"
              color="gray"
            >
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={e => handleChange(e)}
                style={{ display: 'none' }}
              />
              <AiOutlinePlus />
            </ActionIcon>
          </div>
          <div tw="w-full flex-1">
            <TextInput
              required
              placeholder="Type a message"
              size="lg"
              ref={textInputRef}
              value={message}
              onChange={e => setMesssage(e.target.value)}
              styles={{
                input: style.input.base,
                error: style.input.error,
              }}
            />
          </div>
          <div onClick={(e) => e.preventDefault()}>
            <ActionIcon
              onClick={(e) =>{ e.preventDefault(); createConversation(message)}}
              radius="xl"
              size="lg"
              variant="filled"
              color="blue"
              tw="bg-primary"
            >
              <AiOutlineArrowUp />
            </ActionIcon>
          </div>
        </div>
      </Affix>
    </div>
  )
}

Chat.auth = true
Chat.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back
        middle={<p tw="w-full text-center text-lg">Support</p>}
        rightDiv={
          <a href="tel:+2348098460000">
            <MdOutlinePhone size="24" color="#279aed" />
          </a>
        }
      />
      {/* <AppTab /> */}
      <div tw="px-4 py-3 w-full">{page}</div>
    </Layout>
  )
}


export async function getServerSideProps(context: GetServerSidePropsContext){
  const token = await getToken(context);
  // const session = await getServerSession(context.req,context.res,authOptions);
  if(token){
    return {
      props:{
        token,
      }
    }
  }
  return {
    props: {
      // pageStates
    },
  };
}

export default Chat
