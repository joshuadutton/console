import * as React from 'react'
import {Viewer} from '../../../types/types'
import Tokens from './Tokens'
import * as Relay from 'react-relay/classic'
import * as cookiestore from 'cookiestore' import Copy from '../../../components/Copy'

interface Props {
  viewer: Viewer
}

class Authentication extends React.Component<Props, {}> {

  render() {
    const command = `graphcool auth --token "${cookiestore.get('graphcool_auth_token')}"`

    return (
      <div className='authentication-container'>
        <style jsx>{`

          .authentication-container {
            @inherit: .br, .ph38;
            max-width: 700px;
            border-color: rgba( 229, 229, 229, 1);

            .headerContent {
              @inherit: .pt60, .pb25, .ph25, .bb, .bBlack10;
            }

            .headerTitle {
              @inherit: .pb6, .mb4, .black30, .f14, .fw6, .ttu;
            }

            .headerDescription {
              @inherit: .pt6, .mt4, .black50, .f16;
            }
          }

          pre {
            @p: .purple, .code, .br2, .bgDarkBlue04, .dib, .f14, .w100, .overflowAuto, .mt10;
            padding: 2px 4px;
          }
        `}</style>
        <div>
          <div className='headerContent'>
            <div className='headerTitle'>Auth via CLI</div>
            <div className='headerDescription'>
              To authenticate with the graphcool cli without a browser, use the following command
              <Copy text={command}>
                <pre>
                  {command}
                </pre>
              </Copy>
            </div>
          </div>
          <div className='headerContent'>
            <div className='headerTitle'>Permanent Auth Tokens</div>
            <div className='headerDescription'>
              You can use Permanent Access Tokens to grant access to authenticated
              actions as an alternative way to creating an authenticated user.
            </div>
          </div>
          <Tokens project={this.props.viewer.project} />
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(Authentication, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          ${Tokens.getFragment('project')}
        }
      }
    `,
  },
})
