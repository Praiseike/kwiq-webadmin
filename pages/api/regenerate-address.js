import { axios } from '../../libs/axios'
import { getToken } from 'next-auth/jwt'

const BuyDataBundle = async (req, res) => {
  
  const token = await getToken({ req })
  const endpoint = `/address/cor/${req.query.wallet}?regenerate=true`;

  try {
    const response = await axios.get(
      endpoint,
      {
        headers: {
          'x-id-key': token?.xidkey,
        },
      },
    )
    res.status(200).json({ data: response?.data })
  } catch (e) {
    res.status(422).json({ data: e.response.data.errors })
  }
}

export default BuyDataBundle;