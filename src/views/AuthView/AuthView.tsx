import * as React from 'react'
import Auth0LockWrapper from '../../components/Auth0LockWrapper/Auth0LockWrapper'
import {Response} from '../../mutations/AuthenticateCustomerMutation'
import * as cookiestore from 'cookiestore'

interface Props {
  initialScreen: 'login' | 'signUp'
  location: any
}

export default class AuthView extends React.Component<Props, {}> {

  render() {
    const successCallback = async (response: Response) => {
      if ((new Date().getTime() - new Date(response.user.createdAt).getTime()) < 60000) {
        // this is a workaround instead of using the router to re-setup relay
        let signupSource = 'CONSOLE'
        if (this.props.location.query && this.props.location.query.email) {
          signupSource = 'CONSOLE_COLLABORATOR'
        }
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
                signupSource: ${signupSource}
              }) {
                clientMutationId
              }
            }`,
          }),
        })

        window.location.pathname = `/after-signup${this.props.location.search}`
      } else {
        // this is a workaround instead of using the router to re-setup relay
        window.location.pathname = `/${this.props.location.search}`
      }
    }

    return (
      <Auth0LockWrapper
        initialScreen={this.props.initialScreen}
        successCallback={successCallback}
        renderInElement={false}
        location={this.props.location}
      />
    )
  }
}
