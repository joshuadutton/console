import * as React from 'react'
import Popup from '../../components/Popup'
import ShellView from '../../components/ShellView'
import {A} from '../../components/Links'
import {withRouter} from 'react-router'

interface Props {
  projectId: string
  router: ReactRouter.InjectedRouter
}

class CliInfoPopup extends React.Component<Props, null> {
  render() {
    return (
      <Popup onRequestClose={this.props.router.goBack} width={600} closeInside darkBg>
        <div className='cli-info-popup'>
          <style jsx={true}>{`
          .cli-info-popup {
            @p: .pa38, .flex, .flexColumn, .itemsCenter;
          }
          pre {
            @p: .purple, .code, .br2, .bgDarkBlue04, .mh6, .dib, .f14;
            padding: 2px 4px;
          }
          h1 {
            @p: .darkBlue80;
          }
          p {
            @p: .darkBlue60;
          }
          h1, p {
            @p: .tc;
          }
          p {
            @p: .mv25;
          }
        `}</style>
          <h1>Graphcool CLI</h1>
          <p>
            You can edit your schema not only in the Graphcool Console, but also using the <pre>graphcool</pre> CLI,
            following these steps:
          </p>
          <ShellView value={this.getInstructions()} />
          <A
            target='https://www.graph.cool/docs/reference/cli/overview-kie1quohli/'
            className='mt25'
          >
            CLI Docs
          </A>
        </div>
      </Popup>
    )
  }

  private getInstructions() {
    const {projectId} = this.props
    return `\
$ npm install -g graphcool
$ mkdir graphcool-project; cd graphcool-project
$ graphcool pull -p ${projectId}`
  }
}

export default withRouter(CliInfoPopup)
