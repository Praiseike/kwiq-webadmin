import { axios } from '../../libs/axios'
import { getToken } from 'next-auth/jwt'

const GetWallet =  async (req, res) => {
  const token = await getToken({ req })
  if (!token) {
    res.status(401) //no user signed in
  }
  
  if (req.method == 'GET') {
 
    try {
      const response = await axios.get(
        "/user/referrers/count",
        {
          headers: {
            'x-id-key': token?.xidkey,
          },
        },
      )
      res.status(200).json({ data: response?.data })
    } catch (e) {
      res.status(422).json({ data: e.response?.data?.errors })
    }
  }
}

export default GetWallet