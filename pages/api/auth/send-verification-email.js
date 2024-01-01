import { axios } from '../../../libs/axios'
const SendVerificationEmail = async (req , res) => {
  
  if(req.method == "POST"){
    try {
      const response = await axios.post('/user/verify/email', {...req.body})
      res.status(200).json({ data: response.data })
    } catch (e) {
      res.status(422).json({ data: e.response.data })
    }
  }
}

export default SendVerificationEmail