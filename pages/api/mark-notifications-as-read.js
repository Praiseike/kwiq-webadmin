import { axios } from '../../libs/axios'
import { getToken } from 'next-auth/jwt'

const MarkNotificationAsRead = async (req, res) => {
  const token = await getToken({ req })

  if (token) {
    if (req.method == 'PATCH') {
      try {
        const response = await axios.patch(
          '/user/read/notifications',
          {},
          {
            headers: {
              'x-id-key': token?.xidkey,
            },
          },
        )
        res.status(200).json({ data: response?.data })
      } catch (e) {
        res.status(422).json({ data: e.response.data })
      }
    }
  }
}

export default MarkNotificationAsRead
