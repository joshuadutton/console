import * as React from 'react'
import Auth0LockWrapper from '../../../components/Auth0LockWrapper/Auth0LockWrapper'
import {withRouter} from 'react-router'
import {AuthTrigger} from '../types'
import {Response} from '../../../mutations/AuthenticateCustomerMutation'
import * as cookiestore from 'cookiestore'

interface Props {
  updateAuth: (cliToken: string) => Promise<void>
  cliToken: string
  loading: boolean
  router: any
  authTrigger: AuthTrigger
  location: any
}

const redirectURL = (authTrigger: AuthTrigger, showAfterSignup: boolean): string => {
  const afterSignupAddition = showAfterSignup ? '?afterSignup=1' : ''
  switch (authTrigger) {
    case 'auth':
      return `/cli/auth/success${afterSignupAddition}`
    case 'init':
      return `/cli/auth/success-init${afterSignupAddition}`
    case 'quickstart':
      return `https://www.graph.cool/docs/quickstart`
  }
}

class Right extends React.Component<Props, {}> {

  render() {
    const successCallback = async (response: Response) => {
      await this.props.updateAuth(this.props.cliToken)

      const justSignedUp = (new Date().getTime() - new Date(response.user.createdAt).getTime()) < 60000

      if (justSignedUp) {
        await fetch(`${__BACKEND_ADDR__}/system`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookiestore.get('graphcool_auth_token')}`,
          },
          body: JSON.stringify({
            query: `mutation {
              updateCrmCustomerInformation(input: {
                clientMutationId: "asd"
                signupSource: CLI
              }) {
                clientMutationId
              }
            }`,
          }),
        })
      }

      window.location.href = redirectURL(this.props.authTrigger, justSignedUp)
    }

    return (
      <div
        className={`authenticate-right ml60`}
      >
        <style jsx>{`
          .authenticate-right :global(.auth0-lock-header) {
            @p: .dn;
          }
        `}</style>
        <div style={{display: this.props.loading ? 'none' : undefined}}>
          <Auth0LockWrapper
            renderInElement
            successCallback={successCallback}
            initialScreen='signUp'
            location={this.props.location}
          />
        </div>
      </div>
    )
  }

}

export default withRouter(Right)
