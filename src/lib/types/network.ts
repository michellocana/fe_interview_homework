/* Authenticate token */
export type AuthenticateTokenRequest = {
  code: string
  grant_type: 'authorization_code'
  client_id: string
}

export type AuthenticateTokenResponse = {
  access_token: string
  expires_in: number
  refresh_token: string
  token_type: string
}

/* Me */
export type MeResponse = User

/* Tasks */
export type TasksRequest = {}

export type TasksResponse = Task[]
