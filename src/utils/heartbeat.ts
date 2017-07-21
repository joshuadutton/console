import * as cookiestore from 'cookiestore'
import { debounce } from 'lodash'

export default function heartbeat(): () => void {
  let lastUsedProjectId = null
  let authToken = null

  if (cookiestore.has('graphcool_auth_token')) {
    authToken = cookiestore.get('graphcool_auth_token')
  }

  if (cookiestore.has('graphcool_last_used_project_id')) {
    lastUsedProjectId = cookiestore.get('graphcool_last_used_project_id')
  }

  let lastInput = Date.now()

  const eventHandler = debounce(
    () => {
      lastInput = Date.now()
    },
    1000,
    {trailing: true},
  )

  document.addEventListener('mousemove', eventHandler)
  document.addEventListener('keypress', eventHandler)

  if (__HEARTBEAT_ADDR__) {
    const timer = setInterval(
      async () => {
        const payload = {
          resource: 'console',
          token: authToken,
          projectId: lastUsedProjectId,
        }

        // only beat if there was a mousemove event in the last minute
        if (Date.now() - 60000 < lastInput) {
          await fetch(__HEARTBEAT_ADDR__, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          })
        }
      },
      60000,
    )

    return () => {
      clearInterval(timer)
      document.removeEventListener('mousemove', eventHandler)
      document.removeEventListener('keypress', eventHandler)
    }
  }

  return () => {
    // none
  }
}
