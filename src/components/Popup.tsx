import * as React from 'react'
import * as Modal from 'react-modal'
import {fieldModalStyle} from '../utils/modalStyle'
import {Icon, $v} from 'graphcool-styles'
import * as cn from 'classnames'

interface Props {
  onRequestClose: () => void
  width?: number
  closeInside?: boolean
  darkBg?: boolean
}

export default class Popup extends React.Component<Props, null> {
  render() {
    const {closeInside, darkBg} = this.props
    const modalStyle = {
      overlay: {
        ...fieldModalStyle.overlay,
        background: darkBg ? 'rgba(23,42,58,.8)' : 'rgba(255,255,255,.9)',
      },
      content: {
        ...fieldModalStyle.content,
        width: this.props.width || 560,
      },
    }
    return (
      <Modal
        isOpen
        onRequestClose={this.props.onRequestClose}
        style={modalStyle}
      >
        <style jsx>{`
          .modal {
            @p: .bgWhite, .br2;
          }
          .close {
            @p: .absolute, .pointer, .pa10;
            top: -25px;
            right: -25px;
            transform: translate(100%,-100%);
          }
          .close.inside {
            @p: .top0, .right0, .pa25;
            transform: none;
          }
        `}</style>
        <div className='modal'>
          {this.props.children}
        </div>
        <div className={cn('close', {inside: closeInside})} onClick={this.props.onRequestClose}>
          <Icon
            src={require('graphcool-styles/icons/stroke/cross.svg')}
            stroke
            strokeWidth={2}
            color={$v.gray40}
            width={26}
            height={26}
          />
        </div>
      </Modal>
    )
  }
}
