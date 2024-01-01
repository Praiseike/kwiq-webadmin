import { axios } from '../../libs/axios'

const UserPasswordRequest = async (req, res) => {
  if (req.method == 'POST') {
    try {
      const response = await axios.post('/user/password/request', {
        ...req.body,
      })
      res.status(200).json({ data: response?.data })
    } catch (e) {
      res.status(422).json({ data: e.response.data })
    }
  }
}

export default UserPasswordRequest
