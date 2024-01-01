import tw from 'twin.macro'

import { showNotification } from '@mantine/notifications'

export const successNotification = ({
  title,
  message,
}: {
  title?: string
  message?: string
}) =>
  showNotification({
    color: 'green',
    title: title ?? 'Success',
    message: message ?? 'Login successfull',
    disallowClose: true,
    radius: 'md',
    style: tw`backdrop-blur-sm bg-green-400/60 `,
    autoClose: 3000,
    styles: {
      root: {
        '::before': {
          backgroundColor: 'transparent',
        },
      },
      description: {
        color: 'black',
      },
      title: {
        fontWeight: 'bold',
      },
    },
  })

export const unsuccessfullNotification = ({ message }: { message?: string }) =>
  showNotification({
    disallowClose: true,
    title: 'Error!',
    message,
    autoClose: 3000,
    color: 'red',
    radius: 'md',
    style: tw`backdrop-blur-sm bg-red-400/60 `,
    styles: {
      root: {
        '::before': {
          backgroundColor: 'transparent',
        },
      },
      description: {
        color: 'black',
      },
      title: {
        fontWeight: 'bold',
      },
    },
  })
