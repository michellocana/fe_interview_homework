<script lang="ts">
  import type { AxiosResponse } from 'axios'
  import { onMount } from 'svelte'
  import { api } from './api'
  import Login from './lib/components/Login/Login.svelte'
  import Timeline from './lib/components/Timeline/Timeline.svelte'
  import { accessToken, config, user } from './lib/stores/auth'
  import type { AuthenticateTokenRequest, AuthenticateTokenResponse, MeResponse } from './lib/types/network'
  import Spinner from './lib/components/UI/Spinner.svelte'

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

<div class="flex flex-1 items-center justify-center bg-slate-50">
  {#if isLoading}
    <p class="flex items-center gap-3 text-base text-slate-800">
      <Spinner />
      Loading...
    </p>
  {:else if !isLogged}
    <Login />
  {:else}
    <div class="flex w-full flex-1 self-stretch">
      <!-- TODO(michell): improve header -->
      <div class="relative z-10 flex w-72 flex-none items-start gap-2 bg-fuchsia-950 p-2 shadow-xl shadow-slate-900">
        <img src={$user.picture_url} alt={$user.name} class="rounded-full" />
        <p class="text-slate-100">Welcome, {$user.name}</p>
      </div>

      <Timeline />
    </div>
  {/if}
</div>
