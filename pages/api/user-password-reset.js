import { axios } from '../../libs/axios'

const UserPassWordReset = async (req, res) => {
  if (req.method == 'PATCH') {
    try {
      const response = await axios.patch('/user/password/reset', {
        ...req.body,
      })
      res.status(200).json({ data: response?.data })
    } catch (e) {
      res.status(422).json({ data: e.response.data })
    }
  }
}

export default UserPassWordReset
