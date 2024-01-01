import { axios } from '../../libs/axios'
import { getToken } from 'next-auth/jwt'

const AddBank = async (req, res) => {
  const token = await getToken({ req })
  if (!token) {
    res.status(401) //no user signed in
  }

  if (req.method == 'POST') {
    //console.log(token)
    try {
      const response = await axios.post(
        '/user/accounts',
        { ...req.body },
        {
          headers: {
            'x-id-key': token?.xidkey,
          },
        },
      )
      res.status(200).json({ data: response?.data })
    } catch (e) {
      res.status(422).json({ data: e.response?.data })
    }
  }
}

export default AddBank