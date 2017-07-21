import * as React from 'react'
import * as cn from 'classnames'
import {ReactNode} from 'react'

interface Props {
  children?: JSX.Element
  slim?: boolean
  bright?: boolean
  customTip?: ReactNode
  offsetX?: number
  width?: number | string
  cursorOffset?: number
  padding?: number
  top?: boolean
  offsetY?: number
  isOpen?: boolean
}

const Info = (props: Props) => {
  const offsetX = props.offsetX ? (props.offsetX + 'px') : '0px'
  let offsetY = props.offsetY ? (props.offsetY + 'px') : '0px'

  if (props.top) {
    offsetY = `calc(-100% - 40px + ${offsetY})`
  }

  let tooltipStyle = {
    transform: `translate(${offsetX},${offsetY})`,
  }
  if (props.width) {
    tooltipStyle['width'] = props.width
  }

  let tooltipContentStyle = {}
  if (props.padding) {
    tooltipContentStyle['padding'] = props.padding
  }

  const cursorOffset = -(props.offsetX || 0) + (props.cursorOffset ? props.cursorOffset : 0)

  const manual = typeof props.isOpen === 'boolean'

  return (
    <div
      className={cn('info', {manual, open: props.isOpen})}
    >
      <style jsx>{`
      .question-mark {
        @p: .bgBlack10, .flex, .itemsCenter, .justifyCenter, .black40, .f12, .fw6, .br100, .pointer, .ml10;
        width: 18px;
        height: 18px;
      }
      .question-mark.bright {
        @p: .bgBlue, .white;
      }
      .tooltip {
        @p: .dn, .absolute;
        z-index: 999;
        width: 250px;
        padding-top: 5px;
        left: -50px;
      }
      .tooltip.slim {
        width: 200px;
      }
      .tooltip-content {
        @p: .br2, .bgWhite, .pa16, .black50, .f14, .fw4, .relative, .buttonShadow;
      }
      .tooltip-content .before {
        @p: .absolute, .bgWhite;
        content: "";
        top: -4px;
        left: 65px;
        transform: rotate(45deg);
        width: 8px;
        height: 8px;
      }
      .tooltip.top .tooltip-content .before {
        top: initial;
        bottom: -4px;
        left: 60px;
      }
      .info {
        @p: .relative;
      }

      .info:not(.manual):hover .tooltip {
        @p: .db;
      }
      .info:not(.manual):hover .question-mark {
        @p: .bgBlue, .white;
      }

      .info.manual.open .tooltip {
        @p: .db;
      }
      .info.manual.open .question-mark {
        @p: .bgBlue, .white;
      }
    `}</style>
      {props.customTip ? (
          props.customTip
        ) : (
          <div className={'question-mark' + (Boolean(props.bright) ? ' bright' : '')}>
            <span>?</span>
          </div>
        )}
      <div
        className={cn('tooltip', {slim: props.slim, top: props.top})}
        style={tooltipStyle}
      >
        <div className='tooltip-content' style={tooltipContentStyle}>
          <div
            className='before'
            style={{
              transform: `translateX(${cursorOffset}px) rotate(45deg)`,
            }}
          />
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default Info
