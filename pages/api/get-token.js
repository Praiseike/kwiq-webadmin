// This is an example of how to read a JSON Web Token from an API route
import { getToken } from 'next-auth/jwt'


const GetToken = async (req, res) => {
  const token = await getToken({ req })
  if (token) {
    res.status(200).json({ data: token.xidkey})
  } else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}

export default GetToken