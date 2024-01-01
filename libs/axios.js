import Axios from 'axios'

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  //withCredentials: true,
})

export const axiosraw = Axios.create({
  baseURL: 'https://kings-cards-staging.herokuapp.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})
