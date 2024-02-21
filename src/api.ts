import axios from 'axios'
import { ACCESS_TOKEN_KEY } from './lib/constants/localStorage'

export const api = axios.create({
  baseURL: `https://api.plan.toggl.space/api/v6-rc1`,
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)

  if (!config.headers.Authorization) {
    config.headers['Authorization'] = `Bearer ${accessToken}`
  }

  return config
})
