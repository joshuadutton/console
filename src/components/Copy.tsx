import * as React from 'react'
import {$v, Icon} from 'graphcool-styles'
import * as CopyToClipboard from 'react-copy-to-clipboard'

interface Props {
  text: string
  color?: string
}

interface State {
  copied: boolean
}

export default class Copy extends React.Component<Props, State> {

  private copyTimer: any

  constructor(props) {
    super(props)

    this.state = {
      copied: false,
    }
  }

  componentWillUnmount() {
    clearTimeout(this.copyTimer)
  }

  render() {
    let {text, color} = this.props

    color = color || $v.blue

    return (
      <CopyToClipboard
        text={text}
        onCopy={this.onCopy}
      >
        <div className='copy'>
          <style jsx>{`
            .copy {
              @p: .relative, .flex, .itemsCenter, .pointer;
            }
            @keyframes copying {
              0% {
                opacity: 0;
                transform: translate(-50%, 0);
              }

              50% {
                opacity: 1;
              }

              100% {
                opacity: 0;
                transform: translate(-50%, -50px);
              }
            }
            .indicator {
              @p: .absolute;
              top: -20px;
              left: 50%;
              transform: translate(-50%,0);
              animation: copying 700ms linear;
            }
            div :global(i) {
              @p: .o0, .absolute, .right0, .bgWhite, .z2;
              transition: $duration opacity;
            }
            div:hover :global(i) {
              @p: .o100;
            }
          `}</style>
          {this.state.copied && (
            <div className='indicator' style={{color}}>Copied</div>
          )}
          {this.props.children}
          <Icon
            className='ml10 buttonShadow'
            color='rgba(0,0,0,.5)'
            src={require('../assets/icons/copy.svg')}
            width={34}
            height={34}
          />
        </div>
      </CopyToClipboard>
    )
  }

  private onCopy = () => {
    this.setState({copied: true} as State)
    this.copyTimer = window.setTimeout(
      () => this.setState({copied: false} as State),
      500,
    )
  }
}
