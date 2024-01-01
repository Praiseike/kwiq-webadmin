import { axios } from '../../libs/axios'
import { getToken } from 'next-auth/jwt'

const BuyElectricityBill = async (req, res) => {
  
  const token = await getToken({ req })

  if(token){
    if(req.method == "POST"){
      try {
        const response = await axios.post('/user/electricity-bill',
          { ...req.body },
          {
            headers:{
              "x-id-key" : token?.xidkey
            }
          }
        )
        res.status(200).json({ data: response?.data })
      } catch (e) {
        res.status(422).json(
          { data: e.response?.data })
      }
    }
  }
}

export default BuyElectricityBill;