<script lang="ts">
  import type { AxiosResponse } from 'axios'
  import { onMount } from 'svelte'
  import { api } from './api'
  import Login from './lib/components/Login/Login.svelte'
  import Timeline from './lib/components/Timeline/Timeline.svelte'
  import { accessToken, config, user } from './lib/stores/auth'
  import type { AuthenticateTokenRequest, AuthenticateTokenResponse, MeResponse } from './lib/types/network'

  let isLoading = true
  let isLogged = false

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')

    if (code && !$accessToken) {
      const encodedToken = btoa(`${$config.clientId}:${$config.secretId}`)

      const tokenResult = await api.post<
        AuthenticateTokenResponse,
        AxiosResponse<AuthenticateTokenResponse>,
        AuthenticateTokenRequest
      >(
        'authenticate/token',
        {
          code,
          grant_type: 'authorization_code',
          client_id: $config.clientId,
        },
        {
          headers: {
            Authorization: `Basic ${encodedToken}`,
          },
        },
      )

      accessToken.set(tokenResult.data.access_token)
    }

    if ($accessToken) {
      const userResult = await api.get<MeResponse>('me')
      user.set(userResult.data)
    }

    isLoading = false
    isLogged = !!$accessToken
  })
</script>

{#if isLoading}
  Loading...
{:else if !isLogged}
  <Login />
{:else}
  <div class="m-2 flex items-center gap-2">
    <img src={$user.picture_url} alt={$user.name} class="rounded-full" />
    <p>Welcome, {$user.name}</p>
  </div>
  <Timeline />
{/if}
