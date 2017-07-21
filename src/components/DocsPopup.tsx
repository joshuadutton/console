import * as React from 'react'
import Youtube from 'react-youtube'
import * as cn from 'classnames'
import DocsResource from './ModalDocs/DocsResource'
const CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup')

export type ResourceType = 'faq' | 'guide' | 'example' | 'article'

export interface Resource {
  title: string
  link: string
  type: ResourceType
}

interface Props {
  videoId: string
  resources?: Resource[]
  offsetX: number
  offsetY: number
}

interface State {
  isOpen: boolean
}

export default class DocsPopup extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
    }
  }

  render() {
    const {videoId, resources, offsetX, offsetY} = this.props
    const {isOpen} = this.state

    return (
      <div className='docs-popup-wrapper'>
        <style jsx>{`
          .docs-popup-bg {
            @p: .fixed, .top0, .left0, .right0, .bottom0, .bgDarkBlue80, .o0;
            pointer-events: none;
            transition: .3s ease opacity;
          }
          .docs-popup-bg.open {
            @p: .o100;
            pointer-events: all;
          }
          .docs-popup {
            @p: .overflowHidden;
            position: fixed;
            transition: .6s ease all;
          }
          .docs-popup.closed {
            @p: .bgLightgreen20, .ttu, .fw6, .f16, .inlineFlex, .brPill, .justifyCenter, .itemsCenter, .pointer;
            width: 38px;
            height: 38px;
          }
          .docs-popup.open {
            @p: .bgWhite, .overlayShadow, .flex, .br2;
            width: 1020px;
            height: 405px;
            transform: translate(50%, -50%);
          }
          .docs-popup.open .icon {
            @p: .dn;
          }
          .docs-popup :global(a) {
            @p: .noUnderline;
          }
          .resources {
            @p: .pa16;
          }
          .icon {
            @p: .f25, .fw6, .tc, .green;
            @p: .green;
          }
        `}</style>
        <style jsx global>{`
          .docs-popup-enter {
            opacity: 0.01;
          }

          .docs-popup-enter.docs-popup-enter-active {
            opacity: 1;
            transition: opacity 100ms ease-in;
            transition-delay: 700ms;
          }

          .docs-popup-leave {
            opacity: 1;
          }

          .docs-popup-leave.query-header-leave-active {
            opacity: 0.01;
            transition: opacity 300ms ease-in;
          }
        `}</style>
        <div
          className={cn('docs-popup-bg', {open: isOpen, closed: !isOpen})}
          onClick={this.toggle}
        />
        <div
          className={cn('docs-popup', {open: isOpen, closed: !isOpen})}
          style={{
            top: isOpen ? '50%' : offsetY,
            right: isOpen ? '50%' : offsetX,
          }}
          onClick={!isOpen ? this.toggle : null}
        >
          <div
            className='icon'
          >?</div>
          <CSSTransitionGroup
            transitionName='docs-popup'
            transitionEnterTimeout={900}
            transitionLeaveTimeout={20}
          >
            {isOpen && (
              <div className='flex'>
                <div className='video'>
                  <Youtube
                    videoId={videoId}
                    opts={{
                      width: 720,
                      height: 405,
                      playerVars: {
                        autoplay: 0,
                      },

                    }}
                  />
                </div>
                <div className='resources'>
                  {resources.map(resource => (
                    <DocsResource
                      key={resource.link}
                      resource={resource}
                    />
                  ))}
                </div>
              </div>
            )}
          </CSSTransitionGroup>
        </div>
      </div>
    )
  }

  private toggle = () => {
    this.setState(state => {
      return {
        isOpen: !state.isOpen,
      }
    })
  }
}
