<script lang="ts">
  import { AUTH_REDIRECT_URI, TOGGL_PLAN_BASE_URL } from '../../../url'
  import { config } from '../../stores/auth'
  import Button from '../UI/Button.svelte'
  import FormError from '../UI/FormError.svelte'
  import Input from '../UI/Input.svelte'
  import * as yup from 'yup'

  let values = { clientId: $config.clientId, secretId: $config.secretId, workspaceId: $config.workspaceId }
  let validationErrors: Record<string, string> = {}
</script>

<div class="flex flex-1 flex-col items-center justify-center">
  <form
    class="m-2 flex w-full max-w-72 flex-col gap-2 rounded-lg border-2 bg-slate-100 p-4"
    on:submit|preventDefault={async () => {
      const schema = yup.object().shape({
        clientId: yup.string().required('Client ID is required.'),
        secretId: yup.string().required('Secret ID is required.'),
        workspaceId: yup.string().required('Workspace ID is required.'),
      })

      try {
        await schema.validate(values, { abortEarly: false })
        validationErrors = {}
        config.set(values)
        location.href = `${TOGGL_PLAN_BASE_URL}/oauth/login?response_type=code&client_id=${values.clientId}&redirect_uri=${encodeURIComponent(AUTH_REDIRECT_URI)}`
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          validationErrors = error.inner.reduce((acc, err) => {
            return err.path ? { ...acc, [err.path]: err.message } : acc
          }, {})
        }
      }
    }}
  >
    <h1 class="mb-2 text-center text-lg text-slate-800">Sign in</h1>

    <Input bind:value={values.clientId} name="clientId" placeholder="Client ID" />
    <FormError error={validationErrors.clientId} />

    <Input bind:value={values.secretId} name="secretId" placeholder="Secret ID" />
    <FormError error={validationErrors.secretId} />

    <Input bind:value={values.workspaceId} name="workspaceId" placeholder="Workspace ID" />
    <FormError error={validationErrors.workspaceId} />

    <div class="mt-2 w-full">
      <Button type="submit">Login</Button>
    </div>
  </form>
</div>
