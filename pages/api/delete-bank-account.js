import { axios } from '../../libs/axios'
import { getToken } from 'next-auth/jwt'

const DeleteBankAccount = async (req, res) => {
  const token = await getToken({ req })
  if (!token) {
    res.status(401) //no user signed in
  }
  
  if (req.method == 'DELETE') {
    try {
      const response = await axios.delete(
        `/user/account/${req.query.account}`,
        {
          headers: {
            'x-id-key': token?.xidkey,
          },
        },
      )
      res.status(200).json({ data: response?.data })
    } catch (e) {
      //console.log(e.response.data)
      res.status(422).json({ data: e.response?.data?.errors })
    }
  }
}

export default DeleteBankAccount
