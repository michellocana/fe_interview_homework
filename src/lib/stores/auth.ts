import { writable } from 'svelte/store'
import { ACCESS_TOKEN_KEY, CLIENT_ID_KEY, SECRET_ID_KEY, WORKSPACE_ID_KEY } from '../constants/localStorage'
import type { User } from '../types/plan'

function createAccessTokenStore() {
  const { subscribe, set } = writable(localStorage.getItem(ACCESS_TOKEN_KEY) || '')

  return {
    subscribe,
    set: (value: string) => {
      set(value)
      localStorage.setItem(ACCESS_TOKEN_KEY, value)
    },
    reset: () => {
      set('')
      localStorage.removeItem(ACCESS_TOKEN_KEY)
    },
  }
}

type Config = {
  clientId: string
  secretId: string
  workspaceId: string
}

function createConfigStore() {
  const { subscribe, set } = writable<Config>({
    clientId: localStorage.getItem(CLIENT_ID_KEY) || '',
    secretId: localStorage.getItem(SECRET_ID_KEY) || '',
    workspaceId: localStorage.getItem(WORKSPACE_ID_KEY) || '',
  })

  return {
    subscribe,
    set(config: Config) {
      set(config)
      localStorage.setItem(CLIENT_ID_KEY, config.clientId)
      localStorage.setItem(SECRET_ID_KEY, config.secretId)
      localStorage.setItem(WORKSPACE_ID_KEY, config.workspaceId)
    },
  }
}

export let accessToken = createAccessTokenStore()
export let config = createConfigStore()
export let user = writable<User>()
